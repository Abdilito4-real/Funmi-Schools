<?php
// Only process POST requests
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the form fields and remove whitespace
    $formType = isset($_POST['form_type']) ? trim($_POST['form_type']) : '';
    
    // Common fields for both forms
    $firstName = isset($_POST['first_name']) ? trim($_POST['first_name']) : '';
    $lastName = isset($_POST['last_name']) ? trim($_POST['last_name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    
    // Admission form specific fields
    $dob = isset($_POST['dob']) ? trim($_POST['dob']) : '';
    $gender = isset($_POST['gender']) ? trim($_POST['gender']) : '';
    $address = isset($_POST['address']) ? trim($_POST['address']) : '';
    $city = isset($_POST['city']) ? trim($_POST['city']) : '';
    $state = isset($_POST['state']) ? trim($_POST['state']) : '';
    $zip = isset($_POST['zip']) ? trim($_POST['zip']) : '';
    $grade = isset($_POST['grade']) ? trim($_POST['grade']) : '';
    $paymentMethod = isset($_POST['payment_method']) ? trim($_POST['payment_method']) : '';
    
    // Contact form specific fields
    $subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';
    
    // File upload handling
    $fileAttached = false;
    $filePath = '';
    $fileName = '';
    
    if (isset($_FILES['payment_proof']) && $_FILES['payment_proof']['error'] == UPLOAD_ERR_OK) {
        $fileAttached = true;
        $fileName = basename($_FILES['payment_proof']['name']);
        $filePath = 'uploads/' . uniqid() . '_' . $fileName;
        
        // Create uploads directory if it doesn't exist
        if (!file_exists('uploads')) {
            mkdir('uploads', 0777, true);
        }
        
        // Move the uploaded file to the uploads directory
        if (!move_uploaded_file($_FILES['payment_proof']['tmp_name'], $filePath)) {
            $fileAttached = false;
        }
    }
    
    // Check that required fields were filled out
    if (empty($firstName) || empty($lastName) || empty($email)) {
        http_response_code(400);
        echo "Please fill out all required fields.";
        exit;
    }
    
    // For admission form, require payment proof
    if ($formType === 'admission' && !$fileAttached) {
        http_response_code(400);
        echo "Payment proof is required for admission applications.";
        exit;
    }
    
    // Set the recipient email address
    $recipient = "abdallahabubakar269@gmail.com"; // CHANGE THIS TO YOUR EMAIL
    
    // Set the email subject
    $email_subject = "New $formType submission from $firstName $lastName";
    
    // Build the email content
    $email_content = "Form Type: $formType\n\n";
    $email_content .= "First Name: $firstName\n";
    $email_content .= "Last Name: $lastName\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Phone: $phone\n";
    
    if ($formType === 'admission') {
        $email_content .= "\nAdmission Application Details:\n";
        $email_content .= "Date of Birth: $dob\n";
        $email_content .= "Gender: $gender\n";
        $email_content .= "Address: $address\n";
        $email_content .= "City: $city\n";
        $email_content .= "State: $state\n";
        $email_content .= "Zip Code: $zip\n";
        $email_content .= "Grade Applying For: $grade\n";
        $email_content .= "Payment Method: $paymentMethod\n";
    } else if ($formType === 'contact') {
        $email_content .= "\nContact Form Details:\n";
        $email_content .= "Subject: $subject\n";
        $email_content .= "Message: $message\n";
    }
    
    // Build the email headers
    $email_headers = "From: $firstName $lastName <$email>";
    
    // Handle file attachment if exists
    if ($fileAttached) {
        // Read the file content
        $fileContent = file_get_contents($filePath);
        $fileContent = chunk_split(base64_encode($fileContent));
        
        // Generate a boundary string
        $boundary = md5(time());
        
        // Email headers with attachment
        $email_headers = "From: $firstName $lastName <$email>\r\n";
        $email_headers .= "MIME-Version: 1.0\r\n";
        $email_headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
        
        // Email body with attachment
        $email_body = "--$boundary\r\n";
        $email_body .= "Content-Type: text/plain; charset=\"UTF-8\"\r\n";
        $email_body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $email_body .= $email_content . "\r\n\r\n";
        
        // Attachment
        $email_body .= "--$boundary\r\n";
        $email_body .= "Content-Type: application/octet-stream; name=\"$fileName\"\r\n";
        $email_body .= "Content-Disposition: attachment; filename=\"$fileName\"\r\n";
        $email_body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $email_body .= $fileContent . "\r\n";
        $email_body .= "--$boundary--";
    } else {
        $email_body = $email_content;
    }
    
    // Send the email
    if (mail($recipient, $email_subject, $email_body, $email_headers)) {
        // Delete the file after sending
        if ($fileAttached) {
            unlink($filePath);
        }
        
        http_response_code(200);
        echo "Thank you! Your $formType has been submitted.";
    } else {
        http_response_code(500);
        echo "Oops! Something went wrong and we couldn't send your message.";
    }
} else {
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
}
?>