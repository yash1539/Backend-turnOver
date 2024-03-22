const jwt = require('jsonwebtoken');

function extractUserId(req, res, next) {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from header

  // Verify JWT token
  jwt.verify(token, 'your_secret_key', (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Extract user ID and email from decoded token
    res.userId = decodedToken.userId;
    res.email = decodedToken.email;
    next();
  });
}

module.exports = extractUserId;
