<?php
// Contact form handler for Zave Digital
// Place this file as sendmail.php in the same directory as index.php

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

// Honeypot check
if (!empty($_POST["_honey"])) {
    http_response_code(400);
    exit;
}

// Sanitize inputs
$name    = htmlspecialchars(trim($_POST["name"] ?? ""));
$email   = filter_var(trim($_POST["email"] ?? ""), FILTER_SANITIZE_EMAIL);
$phone   = htmlspecialchars(trim($_POST["phone"] ?? ""));
$service = htmlspecialchars(trim($_POST["service"] ?? ""));
$message = htmlspecialchars(trim($_POST["message"] ?? ""));

// Validation
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(["error" => "Please fill in all required fields"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid email address"]);
    exit;
}

// Build email
$to      = "sarmadzavian11@gmail.com";
$subject = "New Lead from Zave Digital Website - " . ucfirst(str_replace("-", " ", $service));

$body  = "New contact form submission from Zave Digital website:\n\n";
$body .= "Name: $name\n";
$body .= "Email: $email\n";
$body .= "Phone: $phone\n";
$body .= "Service: " . ucfirst(str_replace("-", " ", $service)) . "\n";
$body .= "Message:\n$message\n\n";
$body .= "Sent from: " . $_SERVER["HTTP_HOST"] . "\n";
$body .= "Time: " . date("Y-m-d H:i:s") . "\n";

$headers  = "From: noreply@" . $_SERVER["HTTP_HOST"] . "\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// Send
if (mail($to, $subject, $body, $headers)) {
    // Send confirmation to sender
    $confirm_subject = "Thanks for contacting Zave Digital!";
    $confirm_body  = "Hi $name,\n\nThanks for reaching out to Zave Digital!\n\n";
    $confirm_body .= "We've received your inquiry about " . ucfirst(str_replace("-", " ", $service)) . ".\n";
    $confirm_body .= "We'll get back to you within 24 hours.\n\n";
    $confirm_body .= "Best regards,\nZave Digital Team\n";
    $confirm_body .= "WhatsApp: +92 319 4051964\n";
    $confirm_body .= "Website: zavedigital.rf.gd\n";
    
    $confirm_headers = "From: noreply@" . $_SERVER["HTTP_HOST"] . "\r\n";
    @mail($email, $confirm_subject, $confirm_body, $confirm_headers);
    
    http_response_code(200);
    echo json_encode(["success" => "Message sent successfully!"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to send message. Please try WhatsApp instead."]);
}
