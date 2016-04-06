<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Feedback extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('mod_message');
    }

    public function SendFeedback() {
        $mailto = $this->config->item('emailto');     // not nice, but OK for now
        $result = $this->mod_message->ProcessMessage($mailto);
        echo $result;
    }

}
?>