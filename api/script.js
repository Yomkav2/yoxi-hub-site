export default async function handler(req, res) {
    const userAgent = req.headers['user-agent'] || '';
    const token = req.query.token || '';

    if (!userAgent.includes('Roblox')) {
        return res.status(403).send('Access Denied');
    }

    if (!token || token.length < 10) {
        return res.status(400).send('Invalid token');
    }

    try {
        const response = await fetch('https://raw.githubusercontent.com/Yomkav2/YOXI-HUB/main/loader');
        const script = await response.text();

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.status(200).send(script);
    } catch (error) {
        res.status(500).send('-- Script loading failed\nprint("Error:", "' + error.message + '")');
    }
}

vercel.json:
json

{
  "rewrites": [
    { "source": "/script", "destination": "/api/script" }
  ]
}
