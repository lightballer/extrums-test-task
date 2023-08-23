const jwt = require('jsonwebtoken');

function checkUser(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader.split('Bearer ')[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

  console.log({ decodedToken });

  if (!decodedToken) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }

  next();
}

module.exports = { checkUser };
