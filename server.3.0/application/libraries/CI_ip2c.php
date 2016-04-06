<?php

/* This library is an extension (very small) on a class ip2c that is able to extract
 * the location information from an ip address.
 *
 * The original class is freeware and was made by:
 * Copyright 2011 Wouter Snels <info@ofloo.net>
 *
 * This has been done by Johan
 *
 * Usage: in a controller or model:
 * $this->load->library('CI_ip2c');
 *
 * $ip = 'xxx.xxx.xxx.xxx'; // or an ipV6 format
 * $location = $this->ci_ip2c->locate($ip);
 */


require_once(__DIR__ . '../../../3rdparty/3rdparty/ip2c.php');

class CI_ip2c extends ip2c {

    function __construct() {
        
    }

    function IpInfo($ip = '127.0.0.1', $json = true) {

        $this->locate($ip);

        $result = array(
            'address' => array_filter($this->address()), // returns type array ip wich was looked up
            'short' => array_filter($this->abbr_short()), // returns type array 2 char abbreveration
            'long' => array_filter($this->abbr_long()), // returns type array 3 char abbreveration
            'country' => array_filter($this->country()), // returns type array full country name
            'registry' => array_filter($this->registry()), // returns type array registry where the ip was allocated
            'assigned' => array_filter($this->assigned()) // returns type array when the ip was allocated
        );

        if ($json) {
            return json_encode($result);
        } else {
            return $result;
        }
    }

    // source is: http://ip2country.sourceforge.net
    // default output = array 
    // if you want JSON then call IpInfoSF(false, true); // auto ip
    // or                         IpInfoSF('som.ipa.ddr.ess', true) // you deliver ip
    // if you call                IpInfoSF() is the same as auto ip and array output

    function IpInfoSF($ip = false, $json = false) {

        $CI = & get_instance();
        $CI->load->library('curl');

        if (!$ip) {
            $ip = $this->getClientIp();
        }

        $req = 'http://ip2country.sourceforge.net/ip2c.php?ip=' . $ip . '&format=JSON';
        $CI->curl->create($req);
        $curl = $CI->curl->execute();

        $curl = str_replace('{', '{"', $curl);
        $curl = str_replace(':', '":', $curl);
        $curl = str_replace(',', ',"', $curl);

        $curl = json_decode($curl);

        $success = $curl->hostname === '' ? false : true;

        $result = array(
            'address' => $curl->ip, // returns type array ip wich was looked up
            'short' => $curl->country_code, // returns type array 2 char abbreveration
            'long' => $curl->country_code, // returns type array 3 char abbreveration
            'country' => $curl->country_name, // returns type array full country name
            'registry' => false, // returns type array registry where the ip was registered
            'assigned' => $curl->hostname, // returns type array when the ip was allocated
            'success' => $success
        );

        if ($json) {
            return json_encode($result);
        } else {
            return $result;
        }
    }

    function getClientIP() {
        foreach (array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED',
    'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED',
    'REMOTE_ADDR') as $key) {
            if (array_key_exists($key, $_SERVER) === true) {
                foreach (explode(',', $_SERVER[$key]) as $ip) {
                    if (filter_var($ip, FILTER_VALIDATE_IP) !== false) {
                        return $ip;
                    }
                }
            }
        }
    }

}

?>