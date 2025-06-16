const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db'); // Assuming this is where your MySQL connection is

// Register a new user
const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const [result] = await db.promise().query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

    // Send response
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while registering user.' });
  }
};

// Login an existing user
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const user = rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'your_jwt_secret', // Make sure to replace this with a real secret
      { expiresIn: '1h' }
    );

    // Send the token to the client
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// Get the current user data (protected route)
const getCurrentUser = async (req, res) => {
  const userId = req.user.userId; // This comes from the JWT payload
  
  try {
    const [rows] = await db.promise().query('SELECT id, username, email FROM users WHERE id = ?', [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching user data.' });
  }
};

module.exports = { register, login, getCurrentUser };
