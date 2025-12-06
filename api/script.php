<?php
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
$ip = $_SERVER['REMOTE_ADDR'];
$isRoblox = (
    strpos($userAgent, 'Roblox') !== false &&
    strpos($userAgent, 'curl') === false &&
    strpos($userAgent, 'wget') === false &&
    strpos($userAgent, 'Python') === false
);
$hasValidToken = isset($_GET['token']) && preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $_GET['token']);
if ($isRoblox && $hasValidToken) {
    file_put_contents('access.log', date('[Y-m-d H:i:s]') . " IP: $ip | UA: $userAgent | Token: {$_GET['token']}\n", FILE_APPEND);
    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    echo file_get_contents('real_script.lua');
    exit;
}
file_put_contents('blocked.log', date('[Y-m-d H:i:s]') . " BLOCKED IP: $ip | UA: $userAgent | Token: " . ($_GET['token'] ?? 'none') . "\n", FILE_APPEND);
header('Location: https://yoxi-hub.ru');
exit;
?>
