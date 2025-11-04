export function htmlRedirect(req, res, next) {
  // Only handle GET requests
  if (req.method !== 'GET') return next();

  if (req.path.endsWith('.html')) {
    let clean = req.path.replace(/\.html$/, '');
    if (clean === '/index') clean = '/'; 
    
    // Permanent redirect (301)
    return res.redirect(301, clean);
  }

  next(); 
}

export default htmlRedirect;