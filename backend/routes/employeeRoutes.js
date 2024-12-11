const express = require('express');
const { getEmployees, addEmployee, loginEmployee } = require('../controllers/employeeController');
const router = express.Router();

router.get('/', getEmployees);
router.post('/', addEmployee);
router.post('/login', loginEmployee);

module.exports = router;
