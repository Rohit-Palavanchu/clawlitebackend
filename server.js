const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db'); // Assuming db.js is in the config directory

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Define your routes here
app.use('/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/todoRoutes'));

// GET /sessions - Retrieve all user sessions
app.get('/api/sessions', (req, res) => {
  const sql = 'SELECT * FROM sessions';

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error retrieving sessions', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(rows);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
