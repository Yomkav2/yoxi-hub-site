<?php
declare(strict_types=1);


$requiredAgentPart = 'Roblox';
$blockList = ['curl', 'wget', 'python'];
$scriptLocal = __DIR__ . '/real_script.lua';
$remoteFallback = 'https://raw.githubusercontent.com/Yomkav2/YOXI-HUB/main/loader';


$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$token = $_GET['token'] ?? '';

function isValidGuid(string $g): bool {
    return (bool) preg_match('/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/', $g);
}

$uaLower = strtolower($userAgent);
$isRoblox = (stripos($userAgent, $requiredAgentPart) !== false);
foreach ($blockList as $b) {
    if (strpos($uaLower, $b) !== false) {
        $isRoblox = false;
        break;
    }
}

$tokenValid = isValidGuid($token);

if ($isRoblox && $tokenValid) {
    error_log(sprintf("[%s] ALLOWED IP:%s UA:%s TOKEN:%s\n", date('Y-m-d H:i:s'), $ip, $userAgent, $token));

    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: no-referrer');

    if (is_readable($scriptLocal)) {
        readfile($scriptLocal);
        exit;
    }

    $lua = @file_get_contents($remoteFallback);
    if ($lua !== false) {
        echo $lua;
        exit;
    }

    http_response_code(500);
    echo 'Error: script not available.';
    exit;
}

error_log(sprintf("[%s] BLOCKED IP:%s UA:%s TOKEN:%s\n", date('Y-m-d H:i:s'), $ip, $userAgent, $token));

header('Location: https://yoxi-hub.ru', true, 302);
exit;
