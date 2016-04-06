<?php

class Help_base extends CI_Model {

    function __construct() {
        parent::__construct();
    }

    /* Loadtree (load Help-Tree on the left side of the help window
     * requires : POST root_node
     * returns JSON (id(node),text(description),leaf(true/false), root_sort)
     */

    function loadTree() {

        $root_node = postme('node', NULL);
        $book = postme('book', NULL);

        if ($root_node == NULL) {
            return false;
        }

        if ($root_node == 'root') {
            $root_node = $this->config('wordpress_root_id');
        }

        //select all nodes where root node is posted, creates a 'Y' or 'N' if the node has child nodes
        $sql = "select *,case when node in (select root_node from ev_help_nodes) then 'Y'
                else 'N' end as has_childs from ev_help_nodes where root_node = '$root_node' and
                (book = '*' or book='$book') and visible = 1 order by root_sort";


        $query = $this->db->query($sql);
        $rows = $query->num_rows();
        $itemList = NULL;

        foreach ($query->result() as $row) {

            $item = Array(
                "id" => $row->node,
                "text" => $row->description,
                "leaf" => ($row->has_childs == 'Y') ? false : true,
                //"iconCls" => ($row->has_childs == 'Y') ? "folder" : "page",
                "root_sort" => $row->root_sort
            );
            $itemList[] = $item;
        }

        $data = ($rows == 0) ? json_encode('[]') : json_encode($itemList);
        $success = ($rows == 0) ? "true" : "true";                  // should be false, but grid will not empty
        $message = ($rows == 0) ? "No records found" : "OK";

        echo $data;
        return;
    }

    /* loadContent (load content of the selected node
     * requires : POST node
     * returns JSON (id(node),description,content)
     */

    function loadContent() {

        $node = postme('node', NULL);

        if ($node == NULL) {
            return false;
        }

        $sql = "select ev_help_texts.node, ev_help_nodes.description, ev_help_texts.content
                from ev_help_texts, ev_help_nodes  where ev_help_texts.node = ev_help_nodes.node
                and ev_help_texts.node = '$node' ";

        $query = $this->db->query($sql);
        $rows = $query->num_rows();
        $itemList = NULL;

        foreach ($query->result() as $row) {

            $item = Array(
                "id" => $row->node,
                "description" => $row->description,
                "content" => $row->content
            );
            $itemList[] = $item;
        }

        $records = ($rows == 0) ? array() : $itemList;

        $o = array(
            "success" => ($rows == 0) ? "false" : "true",
            "message" => ($rows == 0) ? "No records found" : "OK",
            "records" => $records
        );
        return '(' . json_encode($o) . ')';
    }

    /* loadsearch (load search window on the left side of the help window
     * requires : POST seach
     * returns JSON (id(node),text(description), root_sort)
     */

    function loadSearch() {

        $searchstring = postme('search', NULL);
        $book = postme('book', NULL);

        if ($searchstring == NULL) {
            return false;
        }

        $sql = "select * from ev_help_nodes where (book = '*' or book='$book') and node in (select node from ev_help_texts where ";

        $searcharray = split(' ', $searchstring); //splits the input searchstring into an array where it finds a empty space
        $counter = 0;
        foreach ($searcharray as $element) { // adds the seach values to sql string
            if ($counter == 0) {
                $sql .= "content like '%$element%'";
                $counter++;
            } else {
                $sql .= " and content like '%$element%'";
            }
        }
        $sql .= ")";
        $query = $this->db->query($sql);
        $rows = $query->num_rows();
        $itemList = NULL;


        foreach ($query->result() as $row) {  // create array for records found
            $item = Array(
                "id" => $row->node,
                "text" => $row->description,
                "root_sort" => $row->root_sort
            );
            $itemList[] = $item;
        }

        $records = ($rows == 0) ? array() : $itemList;

        $o = array(
            "success" => ($rows == 0) ? "true" : "true",
            "message" => ($rows == 0) ? "No records found" : "OK",
            "records" => $records
        );
        return '(' . json_encode($o) . ')';
    }

}