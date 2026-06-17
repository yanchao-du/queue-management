const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'queue.json');

function load() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    }
  } catch (e) {}
  return { queue: [], nextId: 1 };
}

function save(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

const db = {
  add(name, phone) {
    const data = load();
    const entry = {
      id: data.nextId++,
      name,
      phone: phone || null,
      created_at: new Date().toISOString()
    };
    data.queue.push(entry);
    save(data);
    return entry;
  },

  getAll() {
    return load().queue;
  },

  getById(id) {
    return load().queue.find(p => p.id === id);
  },

  getByPhone(phone) {
    const queue = load().queue;
    return queue.filter(p => p.phone === phone).pop();
  },

  getPosition(id) {
    const queue = load().queue;
    const index = queue.findIndex(p => p.id === id);
    return index === -1 ? -1 : index + 1;
  },

  remove(id) {
    const data = load();
    const index = data.queue.findIndex(p => p.id === id);
    if (index === -1) return null;
    const [removed] = data.queue.splice(index, 1);
    save(data);
    return removed;
  },

  clear() {
    save({ queue: [], nextId: load().nextId });
  },

  count() {
    return load().queue.length;
  }
};

module.exports = db;
