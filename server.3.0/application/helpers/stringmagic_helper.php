<?php

function return_words($string, $wordsreturned) {
    /*  Returns the first $wordsreturned out of $string.  If string
      contains fewer words than $wordsreturned, the entire string
      is returned.
     */

    $retval = $string;    //    Just in case of a problem
    $array = explode(" ", $string);

    if (count($array) <= $wordsreturned) { //  Already short enough, return the whole thing
        $retval = $string;
    } else

    /*  Need to chop of some words

     */ {

        array_splice($array, $wordsreturned);

        $retval = implode(" ", $array) . "";
    }

    return $retval;
}

function return_characters($string, $charactersreturned) {
    /*  Returns the first characters out of $string.  If string
      contains fewer characters than total characters, the entire string
      is returned.
     */

    $retval = $string;    //    Just in case of a problem

    if (strlen($string) <= $charactersreturned) { //  Already short enough, return the whole thing
        $retval = $string;
    } else {
        $retval = substr($string, 0, $charactersreturned);
    }

    return $retval;
}

?>
