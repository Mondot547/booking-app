const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Récupérer tous les employés
const getEmployees = async (req, res) => {
    const employees = await Employee.find();
    res.json(employees);
};

// Ajouter un employé
const addEmployee = async (req, res) => {
    const { name, email, password, role } = req.body;

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
        name,
        email,
        password: hashedPassword,
        role
    });

    await newEmployee.save();
    res.status(201).json(newEmployee);
};

// Authentification d'un employé
const loginEmployee = async (req, res) => {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(400).json({ message: 'Utilisateur introuvable' });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: employee._id, role: employee.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};

module.exports = { getEmployees, addEmployee, loginEmployee };
