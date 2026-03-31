/**
 * Admin Authentication Middleware
 * 
 * Checks for a valid API key in the Authorization header.
 * Format: Authorization: Bearer <ADMIN_API_KEY>
 * 
 * In development mode (no ADMIN_API_KEY set), all requests are allowed.
 */
module.exports = (req, res, next) => {
  const apiKey = process.env.ADMIN_API_KEY;

  // If no API key is configured, allow all requests (development mode)
  if (!apiKey) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Provide Authorization: Bearer <API_KEY>' });
  }

  const token = authHeader.split(' ')[1];

  if (token !== apiKey) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
};
