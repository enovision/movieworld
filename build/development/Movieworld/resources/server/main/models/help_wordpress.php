<?php

/* this is the wordpress implementation for loading the help structures from
 * the wordpress backend instead of the database itself
 */

class Help_wordpress extends CI_Model {

    function __construct() {
        parent::__construct();

        // this is the base category container to load the tree from
        // see config/custom.js for additional information
        $this->root_node_id = config('wordpress_root_id');

        $this->load->model('curl_wordpress');
    }

    /* Loadtree (load Help-Tree on the left side of the help window
     * requires : POST root_node
     * returns JSON (id(node),text(description),leaf(true/false), root_sort)
     */

    function loadTree() {

        $root_node = $this->postman->getLetter('node');

        if ($this->postman->has_error()) {
            return $this->postman->postHandler();
        }

        if ($root_node == 'root') {
            $root_node = $this->root_node_id;
        }

        // load here the categories from wordpress, starting with the root_node
        $result = json_decode($this->curl_wordpress->get_child_page_index($root_node));

        $records = array_key_exists('records', $result) ? $result->records : array();

        $itemList = array();
        $rows = 0;

        foreach ($records as $row) {

            $item = Array(
                "id" => $row->id,
                "text" => $row->title_plain,
                "leaf" => ($row->children > 0) ? false : true,
                "root_sort" => $row->id
            );
            $rows++;
            $itemList[] = $item;
        }

        $feedback = array(
            'id' => $result->id,
            'success' => true,
            'title_plain' => $result->title_plain,
            'content' => $result->content,
            'records' => $itemList
        );

        $data = json_encode($itemList);
        echo $data;
        return;
    }

    /* loadContent (load content of the selected node
     * requires : POST node
     * returns JSON (id(node),description,content)
     */

    function loadContent() {

        $id = $this->postman->getLetter('node');

        if ($this->postman->has_error()) {
            return $this->postman->postHandler();
        }

        // get the page content
        $result = json_decode($this->curl_wordpress->get_page($id));

        $rows = ($result->status === 'ok') ? 1 : 0;

        if (array_key_exists('page', $result)) {
            $page = $result->page;
        }

        if ($rows > 0) {
            $item = Array(
                "id" => $page->id,
                "description" => $page->title_plain,
                "content" => $page->content
            );
            $itemList[] = $item;
        } else {
            $itemList = array();
        }

        $o = array(
            "success" => ($rows == 0) ? "false" : "true",
            "message" => ($rows == 0) ? "No records found" : "OK",
            "records" => $itemList
        );

        return json_encode($o);
    }

    /* loadsearch (load search window on the left side of the help window
     * requires : POST seach
     * returns JSON (id(node),text(description), root_sort)
     */

    function loadSearch() {

        $searchstring = $this->postman->getLetter('search');

        if ($this->postman->has_error()) {
            return $this->postman->postHandler();
        }

        // get the page content
        $result = json_decode($this->curl_wordpress->get_child_page_index_search($this->root_node_id, $searchstring));

        $records = $itemList = array();

        $rows = 0;
        if (array_key_exists('status', $result)) {
            if ($result->status == 'ok') {
                $records = $result->records;
                $rows++;
            }
        }

        foreach ($records as $page) {  // create array for records found
            $item = Array(
                "id" => $page->id,
                "text" => $page->title_plain,
                "root_sort" => $page->root_sort
            );
            $itemList[] = $item;
        }

        $records = ($rows == 0) ? array() : $itemList;
        $o = array(
            "success" => ($rows == 0) ? "true" : "true",
            "message" => ($rows == 0) ? "No records found" : "OK",
            "records" => $itemList
        );

        return json_encode($o);
    }

}