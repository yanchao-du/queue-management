const db = require('./_db');

module.exports = (req, res) => {
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
};
