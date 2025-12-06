export default function handler(req, res) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');

    res.status(200).send('print("YOMKAA - Server works!")');
}

Проверь vercel.json (должен быть простым):
json

{
  "rewrites": [
    {
      "source": "/script",
      "destination": "/api/script"
    }
  ]
}
