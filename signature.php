<?php

require_once './jssdk.php';

$url = $_GET['url'];

$jssdk = new JSSDK('wx05fe1a08ee8d2a7b', '684bc37baad5b76148c9344275d83682');
$wxconfig = $jssdk->getSignPackage($url);

header('Access-Control-Allow-Origin: *');
echo json_encode($wxconfig);
