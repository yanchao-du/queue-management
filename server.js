const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Join the queue
app.post('/api/join', (req, res) => {
  const { name, phone } = req.body;
  
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
});

// Check queue status (by id or phone)
app.get('/api/status', (req, res) => {
  const { id, phone } = req.query;
  
  let person;
  if (id) {
    person = db.getById(parseInt(id));
  } else if (phone) {
    person = db.getByPhone(phone);
  }
  
  if (!person) {
    return res.json({ inQueue: false, message: 'Not found in queue' });
  }
  
  const position = db.getPosition(person.id);
  const total = db.count();
  
  res.json({
    inQueue: true,
    id: person.id,
    name: person.name,
    position,
    total,
    message: `You are #${position} of ${total} in the queue`
  });
});

// Admin: Get all people in queue
app.get('/api/admin/queue', (req, res) => {
  const queue = db.getAll();
  res.json(queue);
});

// Admin: Check in (remove from queue)
app.post('/api/admin/checkin/:id', (req, res) => {
  const { id } = req.params;
  
  const person = db.remove(parseInt(id));
  if (!person) {
    return res.status(404).json({ error: 'Person not found in queue' });
  }
  
  res.json({ 
    success: true, 
    message: `${person.name} has been checked in`,
    person 
  });
});

// Admin: Clear entire queue
app.delete('/api/admin/queue', (req, res) => {
  db.clear();
  res.json({ success: true, message: 'Queue cleared' });
});

app.listen(PORT, () => {
  console.log(`Queue server running at http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin.html`);
});
