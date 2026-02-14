/**
 * Simple in-memory rate limiter for forgot password endpoint
 * In production, consider using Redis for distributed rate limiting
 */

// Store request counts per IP
const requestCounts = new Map();

// Cleanup old entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now > data.resetTime) {
      requestCounts.delete(key);
    }
  }
}, 15 * 60 * 1000);

/**
 * Rate limiter middleware
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 */
export const rateLimiter = (maxRequests = 5, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    // Get or create entry for this IP
    let entry = requestCounts.get(ip);
    
    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired one
      entry = {
        count: 0,
        resetTime: now + windowMs
      };
    }
    
    entry.count += 1;
    requestCounts.set(ip, entry);
    
    // Check if limit exceeded
    if (entry.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message: `Too many requests. Please try again after ${Math.ceil((entry.resetTime - now) / 1000 / 60)} minutes.`
      });
    }
    
    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - entry.count));
    res.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
    
    next();
  };
};
