const jwt = require('jsonwebtoken');
module.exports = {
  signAccess: (p) => jwt.sign(p, process.env.JWT_SECRET, { expiresIn: '8h' }),
  signRefresh: (p) => jwt.sign(p, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }),
  verifyAccess: (t) => jwt.verify(t, process.env.JWT_SECRET),
  verifyRefresh: (t) => jwt.verify(t, process.env.JWT_REFRESH_SECRET),
};