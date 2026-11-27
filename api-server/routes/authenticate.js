const jwt = require('jsonwebtoken');
const secret = "my-secret-key"; // TODO: move to .env

// Middleware: only continue if the request has a valid "Bearer <token>" header
function authenticated(req, res, next) {
  const authHeader = String(req.headers['authorization'] || '');
  if (!authHeader.startsWith('Bearer ')) {
    res.send({ success: false, code: 401, message: "Unauthorized access - No token" });
    return next(false);
  }
  try {
    const { username, role } = jwt.verify(authHeader.substring(7), secret);
    req.user = { username, role };
    return next();
  } catch (e) {
    res.send({ success: false, code: 401, message: "Unauthorized access - Invalid token" });
    return next(false);
  }
}

// Middleware: only continue if the logged-in user has one of these roles
function requireRole(...roles) {
  return function (req, res, next) {
    if (roles.includes(req.user.role)) return next();
    res.send({ success: false, code: 403, message: "Forbidden - role '" + req.user.role + "' cannot do this" });
    return next(false);
  };
}

function sign(username, role) {
  return jwt.sign({ username, role }, secret, { expiresIn: '1h' });
}

module.exports = { authenticated, requireRole, sign };
