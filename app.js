// app.js
// Simple Express app with in-memory users store and CRUD handlers
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

// In-memory users store for demo purposes
let users = [
  { id: uuidv4(), name: 'Alice', email: 'alice@example.com' },
  { id: uuidv4(), name: 'Bob', email: 'bob@example.com' }
];

// Helper: find user index by id
function findUserIndexById(id) {
  return users.findIndex(u => u.id === id);
}

// Get all users
app.get('/users', (req, res) => {
  res.json(users);
});

// Get user by id
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Create user
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'name and email required' });
  const newUser = { id: uuidv4(), name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Update user
app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const idx = findUserIndexById(id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  const { name, email } = req.body;
  if (name !== undefined) users[idx].name = name;
  if (email !== undefined) users[idx].email = email;
  res.json(users[idx]);
});

// deleteUser function (added)
// Deletes a user by id. If successful, responds with 204 No Content.
// If the user is not found, responds with 404 and a JSON error message.
function deleteUser(req, res) {
  const id = req.params.id;
  const idx = findUserIndexById(id);
  if (idx === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Remove user from the in-memory array
  users.splice(idx, 1);

  // 204 No Content indicates successful deletion without a response body
  return res.status(204).send();
}

// Route for delete user
app.delete('/users/:id', deleteUser);

// Export app and deleteUser for testing if needed
module.exports = { app, deleteUser };

// Start server when run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
