const db = require('../_db');

module.exports = (req, res) => {
  if (req.method === 'GET') {
    const queue = db.getAll();
    return res.json(queue);
  }
  
  if (req.method === 'DELETE') {
    db.clear();
    return res.json({ success: true, message: 'Queue cleared' });
  }
  
  res.status(405).json({ error: 'Method not allowed' });
};
