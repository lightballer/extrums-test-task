const jwt = require('jsonwebtoken');

function checkUser(req, res, next) {
  const authHeader = req.headers.authorization;
  try {
    const token = authHeader.split('Bearer ')[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodedToken) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  } catch (err) {
    console.error(err);
  }
}

module.exports = { checkUser };
