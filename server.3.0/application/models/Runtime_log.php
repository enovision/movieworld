<?php

class Runtime_log extends CI_Model {

    function __construct() {

        parent::__construct();
    }

    function Log($LogMessage) {

        $backtrace = debug_backtrace();
        $IwasCalling = $backtrace[0]['file'];

        $record = array(
            'run_timestamp' => now(),
            'run_php' => $IwasCalling,
            'run_log' => $LogMessage
        );
        $this->db->insert('log_run', $record);
    }

    function LogMe($error404 = NULL) {

        eregi('[^https?:\/\/\.|\][^(w{3}.)].*[^(.info)$]', $_SERVER['HTTP_HOST'], $matched);


        $logrec = array(
            'request_ip' => $_SERVER['REMOTE_ADDR'],
            'requester' => $matched[0],
            'record_ts' => date('Y-m-d H:i:s'),
            'request_ts' => date('Y-m-d H:i:s', $_SERVER['REQUEST_TIME']),
            'request_url' => $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'],
            'request_client' => $_SERVER['HTTP_USER_AGENT'],
            'request_output' => $matched[0],
            'request_language' => $_SERVER['HTTP_ACCEPT_LANGUAGE'],
            'request_secure' => (@$_SERVER['HTTPS'] <> '') ? 'Y' : 'N',
            'request_secid' => 'NOT USED YET',
            'server_admin' => $_SERVER['SERVER_ADMIN'],
            'request_trigger' => (isset($error404)) ? $error404 : "?"
        );

        $this->db->insert('log_ip', $logrec);

        return true;
    }

}
