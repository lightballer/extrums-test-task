const { Router } = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const jwt = require('jsonwebtoken');

const router = Router();

router.post('/register', async (req, res) => {
  const { username, password, isAdmin = false } = req.body;

  try {
    const usernameQuery = 'SELECT * FROM users WHERE username = $1';
    const usernameResult = await pool.query(usernameQuery, [username]);

    if (usernameResult.rows.length > 0) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery =
      'INSERT INTO users (username, password, isAdmin) VALUES ($1, $2, $3) RETURNING id';
    const insertResult = await pool.query(insertQuery, [
      username,
      hashedPassword,
      isAdmin
    ]);

    const userId = insertResult.rows[0].id;

    const token = jwt.sign({ id: userId, username, isAdmin }, process.env.JWT_SECRET_KEY);

    res.json({ token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY,
    );

    res.json({ token });
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
