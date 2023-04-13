<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $full_name = $_POST['full_name'];
    $learning_goal = $_POST['learning_goal'];
    $additional_material = $_FILES['additional_material'];

    $to = 'your-email@example.com';
    $subject = 'New learning inquiry';
    $message = "Full Name: {$full_name}\nLearning Goal: {$learning_goal}";

    $headers = 'From: no-reply@example.com' . "\r\n" .
        'Reply-To: no-reply@example.com' . "\r\n" .
        'X-Mailer: PHP/' . phpversion();

    if ($additional_material['size'] > 0) {
        $attachment = chunk_split(base64_encode(file_get_contents($additional_material['tmp_name'])));
        $filename = $additional_material['name'];

        $boundary = md5(time());
        $headers .= "\r\nMIME-Version: 1.0\r\n" .
            "Content-Type: multipart/mixed; boundary=\"{$boundary}\"";

        $message = "--{$boundary}\r\n" .
            "Content-Type: text/plain; charset=\"UTF-8\"\r\n" .
            "Content-Transfer-Encoding: 7bit\r\n\r\n" .
            $message . "\r\n";
        $message .= "--{$boundary}\r\n" .
            "Content-Type: application/octet-stream; name
