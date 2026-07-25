const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'compu-aboali-dev-secret';

function requireAuth(dbContext) {
  return async (req, res, next) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const payload = jwt.verify(token, JWT_SECRET);
      const user = await dbContext.User.findById(payload.sub);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: 'Invalid or inactive user' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
}

function optionalAuth(dbContext) {
  return async (req, _res, next) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token) return next();
      const payload = jwt.verify(token, JWT_SECRET);
      const user = await dbContext.User.findById(payload.sub);
      if (user && user.isActive) req.user = user;
    } catch (_) {
      /* ignore invalid token for optional auth */
    }
    next();
  };
}

function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

module.exports = { requireAuth, optionalAuth, requireRoles, signToken, JWT_SECRET };
