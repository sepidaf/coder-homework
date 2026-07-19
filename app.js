const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// In-memory users store for demonstration
let users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
];
let nextId = 3;

// List users
app.get('/users', (req, res) => {
  res.json(users);
});

// Get single user
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Create user
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
  const user = { id: nextId++, name, email };
  users.push(user);
  res.status(201).json(user);
});

// Update user
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { name, email } = req.body;
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  res.json(user);
});

// Delete user handler added per request
function deleteUser(req, res) {
  // Support both URL param and JSON body id
  const idParam = req.params && req.params.id;
  const idBody = req.body && req.body.id;
  const id = idParam ? parseInt(idParam, 10) : (idBody ? parseInt(idBody, 10) : NaN);

  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ error: 'Valid user id is required' });
  }

  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const deleted = users.splice(index, 1)[0];
  return res.json({ message: 'User deleted', user: deleted });
}

// Route that uses deleteUser
app.delete('/users/:id', deleteUser);
// Optional: accept DELETE with JSON body { id }
app.delete('/users', deleteUser);

// Export for testing or usage
module.exports = { app, deleteUser, users };

// If run directly, start the server
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
