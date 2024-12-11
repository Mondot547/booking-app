import express from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

// Route d'inscription
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
        }

        // Créer un nouvel utilisateur
        const newUser = new User({
            name,
            email,
            password
        });

        await newUser.save();

        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'inscription', error });
    }
});

// Route de connexion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Trouver l'utilisateur par email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Identifiants incorrects' });
        }

        // Vérifier le mot de passe
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Identifiants incorrects' });
        }

        // Générer un token JWT
        const token = jwt.sign(
            { id: user._id, name: user.name },
            process.env.JWT_SECRET || 'votre_secret_par_defaut',
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur de connexion', error });
    }
});

// Route protégée exemple
router.get('/profile', authenticateJWT, async (req, res) => {
    try {
        // @ts-ignore
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur de récupération du profil' });
    }
});

export default router;