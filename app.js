const express = require('express');
const app = express();
app.use(express.json());

// In-memory user storage for demonstration
let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];

// Get all users
function getUsers(req, res) {
  res.json(users);
}

// Get user by id
function getUserById(req, res) {
  const id = parseInt(req.params.id, 10);
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
}

// Create a new user
function createUser(req, res) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = { id, name };
  users.push(newUser);
  res.status(201).json(newUser);
}

// Update an existing user
function updateUser(req, res) {
  const id = parseInt(req.params.id, 10);
  const { name } = req.body;
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  users[userIndex].name = name;
  res.json(users[userIndex]);
}

// Delete a user
function deleteUser(req, res) {
  const id = parseInt(req.params.id, 10);
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  const deleted = users.splice(userIndex, 1)[0];
  res.json({ message: 'User deleted', user: deleted });
}

// Routes
app.get('/users', getUsers);
app.get('/users/:id', getUserById);
app.post('/users', createUser);
app.put('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);

// Start server if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = {
  app,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
