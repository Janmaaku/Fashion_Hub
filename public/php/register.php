<?php
include "config.php";

// Receive POST data
$first = $_POST['regFirst'];
$last = $_POST['regLast'];
$dob = $_POST['regDob'];
$email = $_POST['regEmail'];
$password = $_POST['regPassword'];

if ($_POST['regPassword'] !== $_POST['regConfirm']) {
    die("Password mismatch!");
}

// 1️⃣ Create Firebase Auth User
$auth_url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=$API_KEY";

$payload = json_encode([
    "email" => $email,
    "password" => $password,
    "returnSecureToken" => true
]);

$ch = curl_init($auth_url);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = json_decode(curl_exec($ch), true);

if (isset($response['error'])) {
    die("Registration Failed: " . $response['error']['message']);
}

$uid = $response['localId'];

// 2️⃣ Store user info in Firestore
$firestore_url = "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/(default)/documents/users/$uid";

$firestore_data = json_encode([
    "fields" => [
        "firstName" => ["stringValue" => $first],
        "lastName"  => ["stringValue" => $last],
        "dob"       => ["stringValue" => $dob],
        "email"     => ["stringValue" => $email],
        "userRole"  => ["integerValue" => 0],   // default buyer
        "createdAt" => ["stringValue" => date("c")]
    ]
]);

$ch = curl_init($firestore_url);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PATCH");
curl_setopt($ch, CURLOPT_POSTFIELDS, $firestore_data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

curl_exec($ch);

// 3️⃣ Save Session
session_start();
$_SESSION['userID'] = $uid;
$_SESSION['userRole'] = 0;

echo "Registration Successful!";
?>
