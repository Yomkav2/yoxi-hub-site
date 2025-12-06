export default function handler(req, res) {
    const userAgent = req.headers['user-agent'] || '';
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    
    if (!userAgent.toLowerCase().includes('roblox')) {
        return res.redirect(302, 'https://yoxi-hub.ru');
    }
    
    const script = `
loadstring(game:HttpGet("https://raw.githubusercontent.com/erxsethis/yoxi/refs/heads/main/loader",true))()
`;
    
    return res.status(200).send(script);
}
