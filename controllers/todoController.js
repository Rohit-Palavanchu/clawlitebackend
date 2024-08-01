const db = require('../config/db');

// Get all to-do items for a user
exports.getTodos = (req, res) => {
  const userId = req.user.id;
  db.all('SELECT * FROM todos WHERE userId = ?', [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching todos' });
    }
    res.json(rows);
  });
};

// Create a new to-do item
exports.createTodo = (req, res) => {
  const { task } = req.body;
  const userId = req.user.id;
  db.run('INSERT INTO todos (task, userId) VALUES (?, ?)', [task, userId], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error creating todo' });
    }
    res.status(201).json({ id: this.lastID });
  });
};

// Update a to-do item
exports.updateTodo = (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  db.run('UPDATE todos SET task = ? WHERE id = ? AND userId = ?', [task, id, req.user.id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating todo' });
    }
    res.json({ message: 'Todo updated' });
  });
};

// Delete a to-do item
exports.deleteTodo = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM todos WHERE id = ? AND userId = ?', [id, req.user.id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting todo' });
    }
    res.json({ message: 'Todo deleted' });
  });
};
