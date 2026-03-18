<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit;
}

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    // If not JSON, try standard POST
    $data = $_POST;
}

$name = trim($data["name"] ?? "");
$email = trim($data["email"] ?? "");
$company = trim($data["company"] ?? "");
$subject_key = trim($data["subject"] ?? "");
$message = trim($data["message"] ?? "");

// Basic validation
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Name, email and message are required."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid email format."]);
    exit;
}

// Prepare email
$to = "tomaszbec@gmail.com";
$email_subject = "Nowa wiadomość z improveit.pl: " . $subject_key;
$email_body = "Otrzymałeś nową wiadomość z formularza kontaktowego improveit.pl.\n\n" .
              "Imię: $name\n" .
              "E-mail: $email\n" .
              "Firma: $company\n" .
              "Temat: $subject_key\n\n" .
              "Wiadomość:\n$message\n";

$headers = "From: contact@improveit.pl\r\n" .
           "Reply-To: $email\r\n" .
           "X-Mailer: PHP/" . phpversion();

// Send email
if (mail($to, $email_subject, $email_body, $headers)) {
    echo json_encode(["status" => "success", "message" => "Twoja wiadomość została wysłana."]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Wystąpił błąd podczas wysyłania wiadomości."]);
}
?>
