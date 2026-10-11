const jwt = require('jsonwebtoken');
const User = require('../Modals/User');

const isSuperUser = (user) => {
  if (!user) return false;
  const superEmails = [
    (process.env.OWNER_EMAIL || '').toLowerCase().trim(),
    'diwakarnagar01@gmail.com',
    'diwakarrajeshnagar@gmail.com',
  ].filter(Boolean);
  return user.role === 'admin' || superEmails.includes((user.email || '').toLowerCase().trim());
};

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'aeroxplore_jwt_secret_fallback_key';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found or token invalid.' });
    }

    user.isSuperUser = isSuperUser(user);
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'aeroxplore_jwt_secret_fallback_key';
      const decoded = jwt.verify(token, secret);
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        user.isSuperUser = isSuperUser(user);
        req.user = user;
      }
    }
  } catch (err) {
    // Optional auth does not error out on invalid token
  }
  next();
};

module.exports = { verifyToken, optionalAuth, isSuperUser };
