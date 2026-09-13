const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: 'Configuration du serveur manquante' });
  }
  try {
    const decoded = jwt.verify(token, secret);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

module.exports = adminAuth;
