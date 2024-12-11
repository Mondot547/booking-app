const jwt = require('jsonwebtoken');

// Clé secrète pour signer les tokens (à stocker de préférence dans les variables d'environnement)
const SECRET_KEY = process.env.JWT_SECRET;

class JwtService {
  // Générer un token JWT
  static generateToken(user) {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role // Ajout du rôle pour les autorisations
      },
      SECRET_KEY,
      { expiresIn: '1h' } // Le token expire après 1 heure
    );
  }

  // Vérifier et décoder un token
  static verifyToken(token) {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.error('Le token a expiré.');
      } else if (error.name === 'JsonWebTokenError') {
        console.error('Token invalide.');
      }
      return null;
    }
  }

  // Middleware d'authentification pour les routes protégées
  static authenticateToken(req, res, next) {
    // Récupérer l'en-tête d'autorisation
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) {
      return res.status(401).json({ message: 'Token manquant. Accès non autorisé.' });
    }

    const decoded = this.verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ message: 'Token invalide ou expiré. Accès interdit.' });
    }

    // Ajouter les informations de l'utilisateur à la requête
    req.user = decoded;
    next();
  }

  // Middleware pour gérer les rôles
  static authorizeRole(requiredRole) {
    return (req, res, next) => {
      if (!req.user || req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Accès interdit pour ce rôle.' });
      }
      next();
    };
  }
}

module.exports = JwtService;
