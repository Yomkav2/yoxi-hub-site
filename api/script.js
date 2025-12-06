module.exports = async (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    const token = req.query.token || '';

    console.log('Request from:', userAgent, 'Token:', token);

    if (!userAgent.toLowerCase().includes('roblox')) {
        res.status(403).send('Access Denied: Invalid User-Agent');
        return;
    }

    if (!token || token.length < 10) {
        res.status(400).send('Bad Request: Invalid token');
        return;
    }

    try {
        const scriptURL = 'https://raw.githubusercontent.com/Yomkav2/YOXI-HUB/main/loader';
        
        const response = await fetch(scriptURL);
        
        if (!response.ok) {
            throw new Error(`GitHub returned ${response.status}`);
        }
        
        const script = await response.text();

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).send(script);
        
    } catch (error) {
        console.error('Error fetching script:', error);
        res.status(500).send(`-- Error loading script\nprint("Server error: ${error.message}")`);
    }
};
