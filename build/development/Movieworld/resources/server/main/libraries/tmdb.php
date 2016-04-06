<?php
require_once($_SERVER['DOCUMENT_ROOT'] . '/3rdparty/tmdb-v3.php');

class CI_TMDb extends TMDb {

    private $API_Key = '77a43a62b58a1f88b5d222df3ff41dc4';
    private $defaultFormat = TMDb::JSON;
    private $defaultLang = 'en';

    function __construct() {

        parent::__construct(
                $this->API_Key,
                $this->defaultFormat,
                $this->defaultLang
        );
    }
}
?>
