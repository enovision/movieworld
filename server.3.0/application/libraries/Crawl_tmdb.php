<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

require(APPPATH . 'config/crawler' . EXT);

class Crawl_tmdb {

    public $result;
    
    function __construct() {
        $this->CI =& get_instance();
        $this->CI->load->helper('crawler');
        $this->CI->load->helper('toolbox');
        $this->CI->load->library('multicurl');
        $this->CI->load->model('mod_tmdb');

        require(APPPATH . 'config/crawler' . EXT);
        $this->Stealer = (object) $config['crawlers'];
        unset($config);
        
        $this->RunInfo = (object) array(
                    'unix_time' => time(),
                    'start_time' => microtime(true),
                    'generation' => gmdate("Y-m-d H:i:s", time())
        );

        $this->ext = $this->Stealer->tmdb['extension'];
        $this->URL = '';

        // BEWARE of the following !!!
        $this->CI->multicurl->StealthCache = true;
        $this->CI->multicurl->StealthPath = $this->Stealer->tmdb['cache_path'];
    }

    function FrontPage() {

        $URL = $this->Stealer->tmdb['url'];

        $this->CI->multicurl->AddToStack(array(
            'url' => $URL)
        );

        $success = $this->CI->multicurl->Execute();

        /*if ($this->CI->multicurl->StealthCache && $success) {
            // first parameter is the entry in the $CI->multicult->result array
            $this->CI->multicurl->CachePage(0, $URL, $this->ext); // save the content to disk
        } */
        
        return $success;
    }

    function BoxOffice() {

        if (empty($this->CI->multicurl->result[0])) {
            echo 'No Curl Done';
            exit;
        }

        $p_start = $this->Stealer->tmdb['boxoffice_start'];
        $p_end = $this->Stealer->tmdb['boxoffice_end'];

        $boxoffice = $this->Scan($this->CI->multicurl->result[0], $p_start, $p_end, 0); //only the box office
        
        $p_start = $this->Stealer->tmdb['boxoffice_item_start'];  // only the id's
        $p_end = $this->Stealer->tmdb['boxoffice_item_end'];
        
        $RawScan = $this->Scan($boxoffice[0]['result'], $p_start, $p_end, 0);

        foreach ($RawScan as $item) {
            
            $p_start = $this->Stealer->tmdb['boxoffice_id_start'];
            $p_end = $this->Stealer->tmdb['boxoffice_id_end'];

            $id = $this->Scan($item['result'], $p_start, $p_end, 0);

            $p_start = $this->Stealer->tmdb['boxoffice_img_start'];
            $p_end = $this->Stealer->tmdb['boxoffice_img_end'];

            $img = $this->Scan($item['result'], $p_start, $p_end, 0);

            $p_start = $this->Stealer->tmdb['boxoffice_name_start'];
            $p_end = $this->Stealer->tmdb['boxoffice_name_end'];

            $name = $this->Scan($item['result'], $p_start, $p_end, 0);

            $this->CI->mod_tmdb->AddBoxoffice(array(
                'type' => 'B',
                'uid' => date( 'Y-m-d H:i:s', $this->uid),
                'id' => $id[0]['result'],
                'name' => $name[0]['result'],
                'img' => $img[0]['result'],
                'c_date' => date('Y.m.d'),
                'c_time' => date('H:i:s')
            ));
        }

        return;
    }

    function Popular() {

        if (empty($this->CI->multicurl->result[0])) {
            echo 'No Curl Done';
            exit;
        }

        $p_start = $this->Stealer->tmdb['popular_start'];
        $p_end = $this->Stealer->tmdb['popular_end'];

        $popular = $this->Scan($this->CI->multicurl->result[0], $p_start, $p_end, 0); //only the box office

        $p_start = $this->Stealer->tmdb['popular_item_start'];  // only the id's
        $p_end = $this->Stealer->tmdb['popular_item_end'];

        $RawScan = $this->Scan($popular[0]['result'], $p_start, $p_end, 0);
        
        foreach ($RawScan as $item) {
            
            $p_start = $this->Stealer->tmdb['popular_id_start'];
            $p_end = $this->Stealer->tmdb['popular_id_end'];

            $id = $this->Scan($item['result'], $p_start, $p_end, 0);
            
            $p_start = $this->Stealer->tmdb['popular_img_start'];
            $p_end = $this->Stealer->tmdb['popular_img_end'];

            $img = $this->Scan($item['result'], $p_start, $p_end, 0);

            $p_start = $this->Stealer->tmdb['popular_name_start'];
            $p_end = $this->Stealer->tmdb['popular_name_end'];

            $name = $this->Scan($item['result'], $p_start, $p_end, 0);
          
            $this->CI->mod_tmdb->AddBoxoffice(array(
                'type' => 'P',
                'id' => $id[0]['result'],
                'uid' => date( 'Y-m-d H:i:s', $this->uid),
                'name' => $name[0]['result'],
                'img' => $img[0]['result'],
                'c_date' => date('Y.m.d'),
                'c_time' => date('H:i:s')
            ));
        }

        return;
    }
    
    function Crawl() {
        $this->uid = time();
        $this->Frontpage();
        $this->Boxoffice();
        $this->Popular();
        return;
    }

    function CloseHandle() {
        $this->CI->multicurl->CloseHandle();
    }

    function ProcessResult($info = array()) {
        return;
    }

    // Scan the result (get the value between the start- and end pattern)
    // multi scanner
    function Scan($Instring, $StartPattern, $EndPattern, $start = 0) {

       /* dump(array(
            'in' => $Instring,
            'st' => $StartPattern,
            'ep' => $EndPattern
        )); */
        
        $scan = array();
        $item = array();

        $lenStartPattern = strlen($StartPattern);
        $lenEndPattern = strlen($EndPattern);

        $FirstPosValue = strpos($Instring, $StartPattern, $start);
        $offset = $FirstPosValue + $lenStartPattern;
        $EndPosValue = strpos($Instring, $EndPattern, $offset);

        while ($FirstPosValue != 0 && $EndPosValue != 0) {

            $returnedLen = $EndPosValue - $offset;
            $item = array(
                'result' => substr($Instring, $offset, $returnedLen)
            );
            $scan[] = $item;

            $start = $EndPosValue + 1;
            $FirstPosValue = strpos($Instring, $StartPattern, $start);
            $offset = $FirstPosValue + $lenStartPattern;
            $EndPosValue = strpos($Instring, $EndPattern, $offset);
        }

        return $scan;
    }

}

?>