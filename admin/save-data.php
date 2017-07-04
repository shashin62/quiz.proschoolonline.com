<?php

$params = json_decode(file_get_contents('php://input'),true);
print_r($params);

$json = $params['json'];

/* sanity check */
if (json_decode($json) != null) {
    $file = fopen('form-data.json', 'w+');
    fwrite($file, $json);
    fclose($file);
    echo 'Save';
} else {
    // user has posted invalid JSON, handle the error 
    echo 'Empty';
}