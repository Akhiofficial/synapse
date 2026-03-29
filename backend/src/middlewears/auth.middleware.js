import jwt from 'jsonwebtoken';

const identifyUser = (req, res, next) => {
  let token;

  // Check if token exists in cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Fallback to Bearer token just in case (optional, but good for testing from postman)
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
     token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECREAT);
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired. Please log in again.' });
    }
    return res.status(401).json({ message: 'Invalid token. Authentication failed.' });
  }
};

export default identifyUser;
