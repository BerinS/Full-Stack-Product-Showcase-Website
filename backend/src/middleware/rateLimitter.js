import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    // IP detection with proxy support
    let ip = getClientIP(req);
    
    // for local development or missing IP
    if (!ip || ip === "unknown" || ip === "127.0.0.1" || ip === "::1") {
      ip = "development";
    }

    const { success, limit, reset, remaining } = await ratelimit.limit(`limit_${ip}`);

    if (!success) {
      // rate limit headers (RFC 6585)
      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', reset);
      
      return res.status(429).json({
        message: "Too many requests, please try again later",
        retryAfter: Math.ceil((reset - Date.now()) / 1000)
      });
    }

    // Add rate limit info to successful requests
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);
    
    next();
  } catch (error) {
    console.error("Rate limit error", error);
    // if rate limit service fails, allow the request
    next();
  }
};

function getClientIP(req) {
  // 1. Check headers from proxies/load balancers
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = forwarded.split(',').map(ip => ip.trim());
    return ips[0]; // first IP in chain is the original client
  }

  // 2. Check other common proxy headers
  const realIP = req.headers['x-real-ip'];
  if (realIP) return realIP;

  // 3. Check cloud provider headers
  const cfConnectingIP = req.headers['cf-connecting-ip'];
  if (cfConnectingIP) return cfConnectingIP;

  // 4. Fallback to direct connection
  return (
    req.ip ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress ||
    "unknown"
  );
}

export default rateLimiter;