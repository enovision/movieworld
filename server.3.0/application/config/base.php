<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| Base parameters used for every project.
| This file supports the base modules of the software, don't put any
| customer related variables in this file please. If done so, you're fired!
|--------------------------------------------------------------------------
|
| $custom = link to the root of the custom scripts etc.
| $title  = title of the website
| 
*/

// NEVER EVER REMOVE ANYTHING FROM THIS FILE !!!!

$config['minify_debug']      = false; //no entry = false, default = false;
$config['minifyme']          = 'http://'.$_SERVER['HTTP_HOST']. '/min/f=';  // local minify implementation (maybe change this !!!)

//-----------------------------------------------------------------------------
// General site block
// never change if you don't know what it is for  !!!!
//-----------------------------------------------------------------------------

// possible change !!!!
$config['logging']           = 1;                                           // Logging of the requests: 1=on, 0=off

//-----------------------------------------------------------------------------
// Date formats
//-----------------------------------------------------------------------------
$config['date_out']   = 'd.m.Y';
$config['date_db']   = 'Y-m-d';

//-----------------------------------------------------------------------------
// Security block (login and security)
//-----------------------------------------------------------------------------

$config['security_key']      = 'letmeshowyouthewaytosanjose';                // the security key for creating cookie keys
$config['captcharequired']   = false;                                        // is captcha required on login (default = false)

//-----------------------------------------------------------------------------
// Email block (for the administration of the website
//-----------------------------------------------------------------------------

// email from mail address,  for customer info address
$config['emailfrom']         = "website@enovision.net";
$config['emailto']           = "jvandemerwe@arumbai.com";

// email from name for customer info mail
$config['emailfromname']     = "Enovision";
$config['emailintern']       = "Feedback:";

// test mail copy address (this is visible for the receiver)
$config['testemailcopy']     = false;
$config['testemail']         = "jvandemerwe@arumbai.com";

// test mail bcc address
$config['testbcccopy']       = false;
$config['testbcc']           = "jvandemerwe@arumbai.com";