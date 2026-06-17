const db = require('./_db');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone } = req.body || {};
  
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  const entry = db.add(name.trim(), phone?.trim() || null);
  const position = db.getPosition(entry.id);
  
  res.json({ 
    id: entry.id,
    position,
    message: `You are #${position} in the queue`
  });
};
