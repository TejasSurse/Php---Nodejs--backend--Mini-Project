<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "localhost";
$username = "root";
$password = "";
$db_name = "login";

$conn = new mysqli($host, $username, $password, $db_name);

if ($conn->connect_error) {
    echo "Connection failed: " . $conn->connect_error;
}
?>