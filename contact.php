<?php
declare(strict_types=1);

// The public form has no database and sends only to VERO's confirmed inbox.
// Replace PHP mail() with authenticated SMTP when a sender mailbox is configured.
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex, nofollow');

function respond(int $status, string $message): void {
    http_response_code($status);
    if (strpos((string)($_SERVER['HTTP_ACCEPT'] ?? ''), 'application/json') !== false) {
        echo json_encode(['message' => $message], JSON_UNESCAPED_SLASHES);
    } else {
        header('Content-Type: text/html; charset=UTF-8');
        $heading = $status === 202 ? 'ENQUIRY ACCEPTED.' : 'PLEASE EMAIL US DIRECTLY.';
        $safeMessage = htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $returnPage = ($_POST['enquiry_type'] ?? '') === 'club_brief' ? './club-brief.html' : './contact.html';
        $returnLabel = $returnPage === './club-brief.html' ? 'Return to club brief' : 'Return to contact';
        echo '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>VERO Enquiry</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#111;color:#fff;font:16px/1.6 Arial,sans-serif}main{max-width:650px;padding:40px}h1{font:bold clamp(44px,8vw,85px)/.95 Impact,Arial,sans-serif;color:#c8a96b}a{color:#c8a96b}</style><main><h1>' . $heading . '</h1><p>' . $safeMessage . '</p><p><a href="' . $returnPage . '">' . $returnLabel . '</a> · <a href="mailto:verofootballagency@gmail.com">Email VERO directly</a></p></main></html>';
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, 'This address accepts enquiry submissions only.');
}

if (isset($_SERVER['HTTP_ORIGIN'])) {
    $originHost = parse_url($_SERVER['HTTP_ORIGIN'], PHP_URL_HOST);
    $siteHost = $_SERVER['HTTP_HOST'] ?? '';
    if (!is_string($originHost) || !hash_equals(strtolower($siteHost), strtolower($originHost))) {
        respond(403, 'Please send your enquiry from the VERO website.');
    }
}

if (!empty($_POST['website'])) {
    respond(400, 'Please use the direct email link instead.');
}

$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$role = trim((string)($_POST['role'] ?? ''));
$club = trim((string)($_POST['club'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));
$enquiryType = trim((string)($_POST['enquiry_type'] ?? ''));
$isClubBrief = $enquiryType === 'club_brief';

if (strlen($name) < 2 || strlen($name) > 100 ||
    strlen($email) > 150 || !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    !in_array($role, ['Player', 'Coach', 'Club', 'Other'], true) ||
    strlen($club) > 120 || !in_array($enquiryType, ['', 'club_brief'], true) ||
    (!$isClubBrief && (strlen($message) < 10 || strlen($message) > 3000))) {
    respond(422, 'Please check the form fields and try again.');
}

$singleLineFields = [$name, $email, $role, $club];
if ($isClubBrief) {
    $contactTitle = trim((string)($_POST['contact_title'] ?? ''));
    $requestType = trim((string)($_POST['request_type'] ?? ''));
    $position = trim((string)($_POST['position'] ?? ''));
    $competition = trim((string)($_POST['competition'] ?? ''));
    $location = trim((string)($_POST['location'] ?? ''));
    $timing = trim((string)($_POST['timing'] ?? ''));
    $terms = trim((string)($_POST['terms'] ?? ''));
    $requirements = trim((string)($_POST['requirements'] ?? ''));
    $constraints = trim((string)($_POST['constraints'] ?? ''));
    if ($role !== 'Club' || strlen($club) < 2 ||
        strlen($contactTitle) < 2 || strlen($contactTitle) > 100 ||
        !in_array($requestType, ['Player', 'Coach'], true) ||
        strlen($position) < 2 || strlen($position) > 120 ||
        strlen($competition) > 120 || strlen($location) > 120 ||
        strlen($timing) < 2 || strlen($timing) > 100 ||
        strlen($terms) > 250 ||
        strlen($requirements) < 20 || strlen($requirements) > 3000 ||
        strlen($constraints) > 600) {
        respond(422, 'Please check the club brief fields and try again.');
    }
    $singleLineFields = array_merge($singleLineFields, [$contactTitle, $requestType, $position, $competition, $location, $timing, $terms]);
}

foreach ($singleLineFields as $field) {
    if (preg_match('/[\r\n\x00-\x1f\x7f]/', $field)) {
        respond(422, 'Please remove control characters from the form fields.');
    }
}

// A small local limit protects the shared mail service without storing messages.
$ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rateFile = sys_get_temp_dir() . '/vero-enquiry-' . hash('sha256', $ip) . '.txt';
$handle = @fopen($rateFile, 'c+');
if ($handle === false || !flock($handle, LOCK_EX)) {
    respond(503, 'Enquiries are temporarily unavailable. Please email us directly.');
}
$raw = stream_get_contents($handle);
$now = time();
$timestamps = array_values(array_filter(array_map('intval', explode(',', (string)$raw)), static fn(int $time): bool => $time > $now - 3600));
if (count($timestamps) >= 3) {
    flock($handle, LOCK_UN);
    fclose($handle);
    respond(429, 'Too many enquiries from this connection. Please email us directly.');
}

if ($isClubBrief) {
    $body = "New VERO club brief\n\n" .
        "Name: {$name}\nEmail: {$email}\nClub / organisation: {$club}\nContact title: {$contactTitle}\n" .
        "Request: {$requestType}\nPosition / coaching role: {$position}\n" .
        ($competition !== '' ? "Competition / level: {$competition}\n" : '') .
        ($location !== '' ? "Club location: {$location}\n" : '') .
        "Target timing: {$timing}\n" .
        ($terms !== '' ? "Budget / terms: {$terms}\n" : '') .
        "\nProfile and project requirements:\n{$requirements}\n" .
        ($constraints !== '' ? "\nPractical considerations:\n{$constraints}\n" : '');
} else {
    $body = "New VERO website enquiry\n\n" .
        "Name: {$name}\nEmail: {$email}\nRole: {$role}\n" .
        ($club !== '' ? "Club / organisation: {$club}\n" : '') .
        "\nMessage:\n{$message}\n";
}

$headers = [
    'From' => 'VERO Website <no-reply@verofootball.com>',
    'Reply-To' => $email,
    'Content-Type' => 'text/plain; charset=UTF-8',
    'X-Mailer' => 'VERO Website',
];

$subject = $isClubBrief ? 'VERO website club brief - ' . $requestType : 'VERO website enquiry - ' . $role;
$accepted = @mail('verofootballagency@gmail.com', $subject, $body, $headers);
if (!$accepted) {
    flock($handle, LOCK_UN);
    fclose($handle);
    respond(503, 'The mail server could not accept your enquiry. Please use the direct email option.');
}

$timestamps[] = $now;
ftruncate($handle, 0);
rewind($handle);
fwrite($handle, implode(',', $timestamps));
fflush($handle);
flock($handle, LOCK_UN);
fclose($handle);

respond(202, 'The mail server accepted your enquiry. Delivery to the inbox has not yet been confirmed.');
