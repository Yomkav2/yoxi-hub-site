export default async function handler(req, res) {
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.headers['x-forwarded-for'] || 'unknown';
    
    console.log(`Request from IP: ${ip}, UA: ${userAgent}`);
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const isRoblox = userAgent.toLowerCase().includes('roblox');
    
    if (!isRoblox) {
        console.log(`Browser detected, redirecting`);
        return res.redirect(302, 'https://yoxi-hub.ru');
    }
    
    try {
        const scriptURL = 'https://raw.githubusercontent.com/erxsethis/yoxi/refs/heads/main/loader';
        
        const response = await fetch(scriptURL, {
            headers: {
                'User-Agent': 'Vercel-Function'
            }
        });
        
        if (!response.ok) {
            throw new Error('GitHub fetch failed');
        }
        
        const script = await response.text();
        
        console.log(`Script loaded successfully, sending to ${ip}`);
        
        return res.status(200).send(script);
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return res.status(200).send(`print("Error loading script: ${error.message}")`);
    }
}
