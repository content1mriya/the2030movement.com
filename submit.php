<?php

declare(strict_types=1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

function clean_value(?string $value, int $maxLength = 1000): string
{
    $value = trim((string)$value);
    $value = strip_tags($value);

    if (mb_strlen($value) > $maxLength) {
        $value = mb_substr($value, 0, $maxLength);
    }

    return $value;
}

function redirect_with_status(string $page, string $status): void
{
    header('Location: ' . $page . '?status=' . urlencode($status));
    exit;
}

// Honeypot anti-spam field
$website = clean_value($_POST['website'] ?? '', 255);
if ($website !== '') {
    redirect_with_status('contacts.html', 'spam_blocked');
}

$formType = clean_value($_POST['form_type'] ?? '', 50);
$name     = clean_value($_POST['name'] ?? '', 100);
$phone    = clean_value($_POST['phone'] ?? '', 50);
$topic    = clean_value($_POST['topic'] ?? '', 100);
$message  = clean_value($_POST['message'] ?? '', 2000);
$course   = clean_value($_POST['course'] ?? '', 150);

if ($formType === 'contact') {
    if ($name === '' || $phone === '') {
        redirect_with_status('contacts.html', 'error');
    }

    $returnPage = 'contacts.html';
} elseif ($formType === 'course_popup') {
    if ($name === '' || $phone === '' || $course === '') {
        redirect_with_status('kurse.html', 'error');
    }

    $returnPage = 'kurse.html';
} else {
    http_response_code(400);
    exit('Invalid form type');
}

$storageDir  = __DIR__ . '/storage/leads';
$storageFile = $storageDir . '/applications.csv';

if (!is_dir($storageDir)) {
    mkdir($storageDir, 0755, true);
}

$isNewFile = !file_exists($storageFile);

$fp = fopen($storageFile, 'ab');

if ($fp === false) {
    redirect_with_status($returnPage, 'save_failed');
}

if (!flock($fp, LOCK_EX)) {
    fclose($fp);
    redirect_with_status($returnPage, 'save_failed');
}

if ($isNewFile) {
    fputcsv($fp, [
        'date_utc',
        'form_type',
        'name',
        'phone',
        'topic',
        'message',
        'course',
        'ip',
        'user_agent'
    ]);
}

fputcsv($fp, [
    gmdate('Y-m-d H:i:s'),
    $formType,
    $name,
    $phone,
    $topic,
    $message,
    $course,
    $_SERVER['REMOTE_ADDR'] ?? '',
    $_SERVER['HTTP_USER_AGENT'] ?? ''
]);

flock($fp, LOCK_UN);
fclose($fp);

redirect_with_status($returnPage, 'success');
