const { Router } = require('express');
const counter = require('../Counter');
const pool = require('../db');
const {
  checkAdmin,
} = require('../middlewares/checkAdmin.middleware');
const {
    checkUser,
  } = require('../middlewares/checkUser.middleware');

const router = Router();

router.get('/counter', checkUser, (req, res) => {
  const currentValue = counter.value;
  res.json({ counter: currentValue });
});

router.post('/counter/increment', checkAdmin, (req, res) => {
  counter.increase();
  const incrementedValue = counter.getValue;
  res.json({ value: incrementedValue });
});

router.post('/counter/decrement', checkAdmin, (req, res) => {
  counter.decrease();
  const decrementedValue = counter.getValue;
  res.json({ value: decrementedValue });
});

router.get('/counter/history', checkUser, async (req, res) => {
  try {
    const response = await pool.query('SELECT * FROM counter ORDER BY id DESC');
    const history = response.rows;
    res.json({ history });
  } catch (error) {
    console.error('Error fetching counter history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
