export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { sub } = req.query;
  if (!sub) { res.status(400).json({ error: 'missing ?sub=' }); return; }

  try {
    const r = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=100&raw_json=1`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RedditStockScanner/1.0)',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    if (!r.ok) {
      res.status(r.status).json({ error: `Reddit returned ${r.status} for r/${sub}` });
      return;
    }

    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
