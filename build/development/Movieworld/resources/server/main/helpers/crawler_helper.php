<?

// Retrieve the result (get the value between the start- and end pattern)
function RetrieveResult($Instring, $StartPattern, $EndPattern) {

    $lenStartPattern = strlen($StartPattern);
    $lenEndPattern = strlen($EndPattern);
    $FirstPosValue = strpos($Instring, $StartPattern, 0);
    $offset = $FirstPosValue + $lenStartPattern;
    $EndPosValue = strpos($Instring, $EndPattern, $offset);

    if ($FirstPosValue != 0 && $EndPosValue != 0) {

        $returnedLen = $EndPosValue - $offset;

        return substr($Instring, $offset, $returnedLen);
        // return $offset.' '.$returnedLen;
    } else {
        return 'Nothing';
    }
}

function IsThisEmpty($Instring) {

    return empty($Instring) ? 1 : 0;
}

// Load of the source code into the memo field (source code retrieval)
function LoadSource($LoadThisURL) {

    return file_get_contents($LoadThisURL);
}

// Convert a string number to a numeric value (including American and World notation check)
function StrToDouble($instring) {

    $match = preg_match_all("/[-+]?[0-9]*\.?,?[0-9]+/",
                    $instring, $RetrievedNumber, PREG_PATTERN_ORDER);

    $resulta = implode($RetrievedNumber[0]);

    $eng = preg_match("/^(-){0,1}([0-9]+)(,[0-9][0-9][0-9])*([.][0-9]){0,1}([0-9]*)$/", $resulta) == 1;
    $world = preg_match("/^(-){0,1}([0-9]+)(.[0-9][0-9][0-9])*([,][0-9]){0,1}([0-9]*)$/", $resulta) == 1;

    if ($eng == 1) {
        return str_replace(',', '.', str_replace(',', '', $resulta));
    } else {
        if ($world == 1) {
            return str_replace(',', '.', str_replace('.', '', $resulta));
        } else {
            return 0;
        }
    }
}

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

    // Scan the result (get the value between the start- and end pattern)
    // multi scanner
    function Scan($Instring, $StartPattern, $EndPattern, $start = 0) {

        $scan = array();
        $item = array();

        $lenStartPattern = strlen($StartPattern);
        $lenEndPattern = strlen($EndPattern);

        $FirstPosValue = strpos($Instring, $StartPattern, $start);

        $offset = $FirstPosValue + $lenStartPattern;
        $EndPosValue = strpos($Instring, $EndPattern, $offset);

     
        while ($FirstPosValue != 0 && $EndPosValue != 0) {

            $returnedLen = $EndPosValue - $offset;
            $item = array(
                'result' => substr($Instring, $offset, $returnedLen)
            );
            $scan[] = $item;

            $start = $EndPosValue + 1;
            $FirstPosValue = strpos($Instring, $StartPattern, $start);
            $offset = $FirstPosValue + $lenStartPattern;
            $EndPosValue = strpos($Instring, $EndPattern, $offset);
        }

        return $scan;
    }

?>