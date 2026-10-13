const { verifyAccess } = require('../utils/jwt');

// Try to load redis — but don't crash if it's not available
let redis = null;
try {
  redis = require('../config/redis');
} catch (e) {
  console.warn('Redis not available — auth will skip blacklist check');
}

exports.auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  let decoded;
  try {
    decoded = verifyAccess(token);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Check redis blacklist — but ONLY if redis is available
  // If redis fails, we still allow the request (fail-open)
  if (redis) {
    try {
      const blocked = await redis.get(`blacklist:user:${decoded.id}`);
      if (blocked) {
        return res.status(401).json({ error: 'Session revoked' });
      }
    } catch (redisErr) {
      // Redis is down — don't block the user, just log
      console.error('⚠️  Redis check failed (allowing request):', redisErr.message);
    }
  }

  req.user = decoded;
  next();
};

exports.requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin only' });
  }
  next();
};

exports.requireEmployee = (req, res, next) => {
  if (req.user?.role !== 'EMPLOYEE') {
    return res.status(403).json({ error: 'Employee only' });
  }
  next();
};