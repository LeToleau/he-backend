const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No autorizado. Token faltante." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Error verificando el token:', err);
    res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;