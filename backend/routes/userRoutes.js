import express from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { authenticateJWT } from '../middleware/authMiddleware';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Route d'inscription
router.post('/register',
    [
        body('name').notEmpty().withMessage('Le nom est requis'),
        body('email').isEmail().withMessage('Email invalide'),
        body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, email, password } = req.body;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
            }
            const newUser = new User({ name, email, password });
            await newUser.save();
            res.status(201).json({ message: 'Utilisateur créé avec succès' });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de l\'inscription', error });
        }
    }
);

// Route de connexion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé. Veuillez vérifier votre email.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mot de passe incorrect. Veuillez réessayer.' });
        }

        const token = jwt.sign(
            { id: user._id, name: user.name, role: user.role },
            process.env.JWT_SECRET || 'votre_secret_par_defaut',
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur de connexion', error });
    }
});

// Route de profil
router.get('/profile', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur de récupération du profil' });
    }
});

// Mise à jour du profil
router.put('/profile', authenticateJWT, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du profil', error });
    }
});

export default router;
