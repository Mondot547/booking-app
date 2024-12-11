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
        name: user.name
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
      return null;
    }
  }

  // Middleware d'authentification pour les routes protégées
  static authenticateToken(req, res, next) {
    // Récupérer l'en-tête d'autorisation
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) return res.sendStatus(401); // Pas de token

    const decoded = this.verifyToken(token);
    if (!decoded) return res.sendStatus(403); // Token invalide

    // Ajouter les informations de l'utilisateur à la requête
    req.user = decoded;
    next();
  }
}

module.exports = JwtService;