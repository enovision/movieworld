<?php
/*This model can only be used for functions that are related to the interface of CodeIgniter
 * and the ExtJS framework. This model is not allowed to be modified, without consent of the
 * owner.
 *
 * function list:
 * extJson - make an array out of SQL, ExtJS JSON compatible
 *
*/
class Functions {

    public function Functions() {
        $CI =& get_instance();
        $CI->load->helper('html');
    }

    function GetData() {                                     //Get the Data Array Variables

        $meta = array( // array('name' => 'robots', 'content' => 'no-cache'),
                array('name' => 'description', 'content' => config('title')),
                array('name' => 'keywords', 'content' => 'Enovision GmbH, Business in a browser, extjs web applications'),
                array('name' => 'robots', 'content' => 'no-cache'),
                array('name' => 'Content-type', 'content' => 'text/html; charset=utf-8', 'type' => 'equiv')
        );

        $data['title'] = config('title');                    //title of the website
        $data['meta'] = meta($meta);
        $doctype = doctype();
        $data['doctype'] = $doctype;
        $data['base'] = config('base_url');                  //basic url of the website
        $data['cssdir'] = config('cssdir');                  //basic css directory of the website
        $data['css'] = config('css');                        //basic css of the website
        $data['custom'] = config('custom');                  //'root' of the other custom code and scripts
        $data['js'] = config('js');                          //'root' of the other custom javascript
        return $data;
    }
}
