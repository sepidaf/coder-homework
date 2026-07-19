// app.js
const express = require('express');
const app = express();
app.use(express.json());

// In-memory users store (id -> user)
const users = {};

// Create a new user
function createUser(req, res) {
  const id = Date.now().toString();
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }
  users[id] = { id, name, email };
  return res.status(201).json(users[id]);
}

// Get a user by id
function getUser(req, res) {
  const { id } = req.params;
  const user = users[id];
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json(user);
}

// Update a user by id
function updateUser(req, res) {
  const { id } = req.params;
  const user = users[id];
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { name, email } = req.body;
  users[id] = { ...user, ...(name ? { name } : {}), ...(email ? { email } : {}) };
  return res.json(users[id]);
}

// Delete a user by id
// Added deleteUser function as requested. It removes the user from the in-memory store
// and returns 204 No Content on success, or 404 if the user does not exist.
function deleteUser(req, res) {
  const { id } = req.params;
  const user = users[id];
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  delete users[id];
  // 204 No Content — successful deletion
  return res.status(204).send();
}

// Routes
app.post('/users', createUser);
app.get('/users/:id', getUser);
app.put('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);

// Start server if run directly
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = { app, createUser, getUser, updateUser, deleteUser };
