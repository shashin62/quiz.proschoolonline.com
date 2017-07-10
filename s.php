<?php session_start();

$temp_s = $_SESSION;
//print_r($temp_s);

print_r(unserialize($temp_s['FrontUser']));

print_r($_COOKIE['LoginProschool']);
print_r($_COOKIE);

