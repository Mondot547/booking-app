const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Générer un token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Inscription
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        }

        const newUser = await User.create({ name, email, password });
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            token: generateToken(newUser._id)
        });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de l’inscription.', error: err.message });
    }
};

// Connexion
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mot de passe incorrect.' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la connexion.', error: err.message });
    }
};

// Récupérer les informations de l'utilisateur connecté
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password'); // Exclure le mot de passe
    if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.json(user);
};

module.exports = { registerUser, loginUser, getUserProfile };
