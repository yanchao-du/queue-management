const db = require('../_db');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  
  const person = db.remove(parseInt(id));
  if (!person) {
    return res.status(404).json({ error: 'Person not found in queue' });
  }
  
  res.json({ 
    success: true, 
    message: `${person.name} has been checked in`,
    person 
  });
};
