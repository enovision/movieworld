<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

if (!function_exists('config')) {

    // config is a helper that makes it possible to limit the coding effort on
    // retrieving config values, when second parameter is 'true' then the result
    // will be echoed instead of returned (default is returned)

    function config($item = '', $return = false) {
        
        $CI = & get_instance();
        $result = $CI->config->item($item);

        dump($item);
        
        if ($return == false)
            return $result;
        echo $result;
        return;
    }

    function parsejson($text) {

        // take away the () brackets at the beginning and end of the file
        $text = (substr($text, 0, 1) == '(' && substr($text, strlen($text) - 1, 1) == ')') ? substr($text, 1, strlen($text) - 2) : $text;
        $parsedText = str_replace(chr(10), "", $text);
        return str_replace(chr(13), "", $parsedText);
    }

    function removeCRLF($text) {
        $text = str_replace("\x0D", "", $text);
        $text = str_replace("\x0A", "", $text);
        return $text;
    }

    function cv_date($my_date, $format = NULL) {

        $fmt = ($format == NULL) ? config('date_out') : $format;
        $my_time = strtotime($my_date);
        return date($fmt, $my_time);
    }
    
    function cv_time($my_date, $format = NULL) {

        $fmt = ($format == NULL) ? config('time_out') : $format;
        $my_time = strtotime($my_date);
        return date($fmt, $my_time);
    }    
}