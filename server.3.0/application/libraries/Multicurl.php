<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * CodeIgniter MultiCurl Class
 *
 * Work with remote servers via cURL much easier than using the native PHP bindings.
 * But then with Multiple Fake Threading
 *
 * @package        	CodeIgniter
 * @subpackage    	Libraries
 * @category    	Libraries
 * @author        	Johan van de Merwe
 * @thanks          Lineke Kerckhoffs-Willems
 */
class Multicurl {

    private $_ci;    // CodeIgniter instance
    private $timeout = 30;
    public $result = array();
    public $stack_count = 0;
    public $info = array();  // all additional stuff that comes with the AddToStack
    public $log = array();  // runtime log data
    public $StealthCache = false;  // if this is set to true, all crawl pages will be saved on disk
    public $StealthPath = '';     // this is where multicurl will look first, before crawling it
    public $CrawlCounter = 0;

    function __construct() {
        $this->_ci = & get_instance();

        $this->mh = curl_multi_init();
        $this->handles = array();
    }

    function InitCurl() {
        $this->mh = curl_multi_init();
        $this->handles = array();
        return;
    }

    function CachePage($content = 0, $url, $ext = '.bck') {

        $url = str_replace('http://', '', $url);
        $url = str_replace('.', '_', $url);

        $path = $this->StealthPath;
        $file = $url . $ext;

        if (isset($this->result[$content])) {
            $handle = fopen($path . $file, "w+");
            $r = fputs($handle, $this->result[$content]);
        }

        return;
    }

    function AddToStack($info = array()) {

        if (array_key_exists('url', $info) === false) {
            echo 'No URL for this stack given';
            return;
        }

        if (array_key_exists('overwrite', $info) && $info['overwrite'] === true) {
            $this->ResetStack();
        }

        $this->Queue[] = array(
            'url' => $info['url'],
            'postdata' => array_key_exists('postdata', $info) ? $info['postdata'] : false,
            'timeout' => array_key_exists('timeout', $info) ? $info['timeout'] : $this->timeout,
            'file' => (array_key_exists('file', $info)) ? $info['file'] : false,
            'path' => (array_key_exists('path', $info)) ? $info['path'] : false,
            'save' => (array_key_exists('save', $info)) ? $info['save'] : true,
            'ext' => (array_key_exists('ext', $info)) ? $info['ext'] : '.detail'
        );

        $this->info[] = (array_key_exists('info', $info)) ? $info['info'] : array();

        $this->StackCount++;
    }

    function ResetStack() {
        $this->handles = $this->info = $this->Queue = $this->Stack = array();
        $this->StackCount = 0;
        return true;
    }

    function ExecStack($info = array()) {

        if (empty($this->Queue)) {
            return false;
        }

        $parallel = (array_key_exists('parallel', $info)) ? $info['parallel'] : 3;

        $submit = 0;
        foreach ($this->Queue as $queue) {
            $this->Stack[] = $queue;
            if ($submit < $parallel) {
                $submit++;
            } else {
                $this->Execute(true);
                $this->Stack = array();
                $this->handles = array();
                $submit = 0;
            }
        }
        // process the remainder
        if ($submit > 0) {
            $this->Execute(true);
        }

        return true;
    }

    function Execute($has_queue = false) {

        if ($has_queue === false) {
            $this->Stack = $this->Queue;
        }

        if (empty($this->Stack)) {
            return false;
        }

        $this->log['exec_start'] = $this->TimeStamper();

        foreach ($this->Stack as $idx => $exec) {              //<<<<< here is the $exec !!!!
            $this->log[$idx] = array(
                'curl_init' => $this->TimeStamper()
            );

            // create a new single curl handle
            $ch = curl_init();

            // setting several options like url, timeout, returntransfer
            // simulate multithreading by calling the wait.php script and sleeping for $rand seconds
            curl_setopt($ch, CURLOPT_URL, $exec['url']);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            if (array_key_exists('postdata', $exec) && $exec['postdata'] !== false) {
                curl_setopt($ch, CURLOPT_POST, false);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $exec['postdata']);
            }
            curl_setopt($ch, CURLOPT_TIMEOUT, $exec['timeout']);

            // add this handle to the multi handle
            curl_multi_add_handle($this->mh, $ch);

            // put the handles in an array to loop this later on
            $this->handles[] = $ch;
        }

        // execute the multi handle
        $active = null;

        $this->log['multi_exec'] = $this->TimeStamper();

        do {
            $mrc = curl_multi_exec($this->mh, $active);
        } while ($mrc == CURLM_CALL_MULTI_PERFORM);

        while ($active && $mrc == CURLM_OK) {
            if (curl_multi_select($this->mh) != -1) {
                do {
                    $mrc = curl_multi_exec($this->mh, $active);
                } while ($mrc == CURLM_CALL_MULTI_PERFORM);
            }
        }

        $this->log['getcontent'] = $this->TimeStamper();

        // get the content of the urls (if there is any)
        for ($i = 0; $i < count($this->handles); $i++) {
            // get the content of the handle

            array_push($this->log[$i], $this->TimeStamper());

            ob_start();      // prevent any output
            $this->result[$i] = curl_multi_getcontent($this->handles[$i]);
            ob_end_clean();  // stop preventing output
            $http_code = curl_getinfo($this->handles[$i], CURLINFO_HTTP_CODE);
            $this->CrawlCounter++;

            $exec = $this->Stack[$i];  // this is important
            if ($exec['save'] === true && $exec['path'] !== false && $exec['file'] !== false) {
                $file = $exec['file'];
                $this->StealthPath = $exec['path'];
                $this->CachePage($i, $file, $exec['ext']); // save the content to disk
                unset($this->result[$i]); // remove the entry
            }

            $this->LogCurl($this->handles[$i], $exec['postdata']);

            array_push($this->log[$i], $this->TimeStamper());

            // remove the handle from the multi handle
            curl_multi_remove_handle($this->mh, $this->handles[$i]);
        }

        $this->log['multi_close'] = $this->TimeStamper();


        return true;
    }

    function CloseHandle() {

        // close the multi curl handle to free system resources
        curl_multi_close($this->mh);
    }

    function TimeStamper() {
        $starttime = microtime();
        $startarray = explode(" ", $starttime);
        $starttime = $startarray[1] + $startarray[0];
        return $starttime;
    }

    private function LogCurl($handle, $info = false) {

        $record = curl_getinfo($handle);
        if (!$info) {
            $record['info'] = $info;
        }

        $this->_ci->db->insert('curl_log', $record);
    }

}

?>
