const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Initialisation
dotenv.config();
connectDB();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));

// Port d'écoute
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
