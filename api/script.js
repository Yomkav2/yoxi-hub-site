const requestCounts = new Map();

setInterval(() => {
    requestCounts.clear();
}, 600000);

export default async function handler(req, res) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || '';
    const token = req.query.token || '';
    const timestamp = new Date().toISOString();
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    const currentCount = requestCounts.get(ip) || 0;
    if (currentCount >= 10) {
        console.log(`[${timestamp}] [RATE_LIMIT] IP: ${ip} | Count: ${currentCount}`);
        res.status(429).send('print("❌ Stop.")');
        return;
    }
    requestCounts.set(ip, currentCount + 1);
    
    const userAgentLower = userAgent.toLowerCase();
    const isRoblox = userAgentLower.includes('roblox');
    
    const blockedAgents = ['curl', 'wget', 'python', 'postman', 'insomnia', 'httpie'];
    const isBlocked = blockedAgents.some(agent => userAgentLower.includes(agent));
    
    if (!isRoblox || isBlocked) {
        console.log(`[${timestamp}] [BLOCKED_UA] IP: ${ip} | UA: ${userAgent}`);
        
        if (userAgentLower.includes('mozilla') || userAgentLower.includes('chrome')) {
            res.setHeader('Location', 'https://yoxi-hub.ru');
            res.status(302).send('Redirecting...');
            return;
        }
        
        res.status(403).send('print("❌ Access Denied")');
        return;
    }
    
    const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    const isValidToken = guidRegex.test(token);
    
    if (!isValidToken) {
        console.log(`[${timestamp}] [INVALID_TOKEN] IP: ${ip} | Token: ${token}`);
        res.status(403).send('print("❌ Access Denied")');
        return;
    }
    
    try {
        console.log(`[${timestamp}] [SUCCESS] IP: ${ip} | Token: ${token.substring(0, 8)}...`);
        
        const scriptURL = 'https://raw.githubusercontent.com/erxsethis/yoxi-hub-site/refs/heads/main/api/main_script';
        
        const response = await fetch(scriptURL);
        
        if (!response.ok) {
            throw new Error(`returned status ${response.status}`);
        }
        
        const script = await response.text();
        
        if (!script || script.trim().length === 0) {
            throw new Error('Empty script received');
        }
        
        const wrappedScript = `-- YOXI HUB
-- Loaded at: ${timestamp}
-- Token: ${token.substring(0, 8)}...

${script}`;
        
        res.status(200).send(wrappedScript);
        
    } catch (error) {
        console.error(`[${timestamp}] [ERROR] IP: ${ip} | Error: ${error.message}`);
        
        const errorScript = `
-- YOXI HUB Error
print("❌ Failed to load YOXI HUB")
print("Error: ${error.message}")
print("Please try again later or contact support")

game.Players.LocalPlayer:Kick("Failed to load YOXI HUB. Error: ${error.message}")
`;
        
        res.status(500).send(errorScript);
    }
}
