/**
 * Development identity/authentication middleware.
 * Resolves request context user identity from X-User-Email header.
 * Designed to be easily swappable with JWT/OAuth middleware in production.
 */
export const requireAuth = (req, res, next) => {
  const email = req.headers['x-user-email'] || req.headers['authorization'];
  
  if (!email) {
    return res.status(401).json({
      error: 'Unauthenticated: No user session header found. Please login.'
    });
  }
  
  // Isolate development identity lookup so we don't have userEmail coming from body
  req.user = {
    email: email.trim().toLowerCase()
  };
  
  next();
};
