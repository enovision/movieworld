<?php

/* This model contains the model functionality for sending messages to queue and email
 */

class mod_message extends CI_Model {

    function __construct() {
        parent::__construct();

        $this->mailto = 'johndoe@domain.com';
        $this->load->library('email');
        
    }

    function ProcessMessage($mailto = false) {

        if ($mailto != false) {
            $this->mailto = $mailto;
        }
        
        $name = $this->input->post('name');         // from
        $subject = $this->input->post('subject');   // subject
        $message = $this->input->post('message');   // message
        $reply = $this->input->post('reply');       // reply by: email, phone, none 
        $email = $this->input->post('email');       // email address
        $module = $this->input->post('module');     // module f.e 'tmdb'
        
        if ($email === false) $email = 'none';
        if ($module === false) $module = 'none';        

        $this->LogMessage($name, $subject, $message, $email, $this->mailto, $module, $reply);
        $this->SubmitEmail($name, $subject, $message, $email, $this->mailto, $reply);

        return json_encode(array(
                    'success' => true,
                    'message' => 'Thank you for your feedback'
                ));
    }

    // this is sending the message to the message table fa_bericht
    private function LogMessage($name, $subject, $message, $email, $mailto, $module = 'none', $reply = 'none') {
        $this->db->insert('message', array(
            'msg_module' => $module,
            'msg_date' => date("Y-m-d H:i:s"),
            'msg_name' => $name,
            'msg_reply' => $reply,
            'msg_email' => $email,
            'msg_emailto' => $mailto,
            'msg_subject' => $subject,
            'msg_message' => $message,
            'msg_ip' =>  $_SERVER['REMOTE_ADDR'],
            'msg_status' => 0
        ));
    }

    // this is sending the message also by email. It will find the users email and
    // send an email message. The sender is the owner of the tan from the user logged in
    function SubmitEmail($name, $subject, $message, $email, $mailto, $reply) {
        $this->sendMail($reply, $subject, $message, $mailto, $name, $email);
    }

    function sendMail($reply, $subject, $message, $mailto, $name, $email, $cc = false, $bcc = false, $priority = 3) {

        if ($cc !== false) {
            $this->email->cc($cc);
        }
        if ($bcc !== false) {
            $this->email->bcc($bcc);
        }

        $priority = ($priority == '2') ? 1 : 3;

        
        $_from = $this->config->item('emailfrom');
        $_name = $this->config->item('emailintern');

        $body = "
This is a system generated message!\r
-------------------------------------------------------------\r
From:\r
$name\r
-------------------------------------------------------------\r
Reply:\r
$reply\r        
-------------------------------------------------------------\r
Reply To:\r
$email\r        
-------------------------------------------------------------\r
Subject:\r
$subject\r
-------------------------------------------------------------\r
$message\r
-------------------------------------------------------------\r";

        $this->email->to($mailto);
        $this->email->from($_from, $_name . ' ' . $name);
        $this->email->subject($subject);
        $this->email->message($body);
        $this->email->priority = $priority;
        // email send (this is what it is all about)
        $this->email->send();

        return true;
    }

}
?>