const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Ensure this path is correct

// POST /register - Register a new user
router.post('/register', authController.register);

// POST /login - Log in an existing user
router.post('/login', authController.login);

module.exports = router;
