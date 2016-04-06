<?php

class Help extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->library('functions');                  // library: non-database related functions are in this model
        $this->load->model('help_base');                    // load the model for the seminars db functions
        $this->load->model('help_wordpress');               // load the model for the seminars db functions
    }

    function ShowHelp() {
        $inparm = postme('parameter', NULL);

        $result = false;

        switch ($inparm) {
            case 'loadcontent':
                if (config('wordpress_help') === true) {
                    $result = $this->help_wordpress->loadContent();
                } else {
                    $result = $this->help_base->loadContent();
                }
                break;
            case 'loadsearch':
                if (config('wordpress_help') === true) {
                    $result = $this->help_wordpress->loadSearch();
                } else {
                    $result = $this->help_base->loadSearch();
                }
                break;
            case 'loadtree':
                if (config('wordpress_help') === true) {
                    $result = $this->help_wordpress->loadTree();
                } else {
                    $result = $this->help_base->loadTree();
                }
                break;
        }
        echo $result;
        return;
    }

}