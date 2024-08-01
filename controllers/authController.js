const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Ensure this path is correct

const SECRET_KEY = 'your_secret_key'; // Replace with your actual secret key

const register = (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err.message);
      return res.status(500).json({ message: 'Error hashing password' });
    }

    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function(err) {
      if (err) {
        console.error('Error inserting user:', err.message);
        return res.status(500).json({ message: 'Error inserting user' });
      }

      res.status(201).json({ message: 'User registered successfully' });
    });
  });
};

const login = (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.error('Error retrieving user:', err.message);
      return res.status(500).json({ message: 'Error retrieving user' });
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error('Error comparing passwords:', err.message);
        return res.status(500).json({ message: 'Error comparing passwords' });
      }
      
      if (!result) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
      const loginTime = new Date().toISOString(); // Use ISO format for consistency

      // Use parameterized query to avoid SQL injection
      db.run('INSERT INTO sessions (userId, loginTime) VALUES (?, ?)', [user.id, loginTime], function(err) {
        if (err) {
          console.error('Error inserting session:', err.message);
          return res.status(500).json({ message: 'Error inserting session' });
        }

        res.json({ token });
      });
    });
  });
};

module.exports = { register, login };
