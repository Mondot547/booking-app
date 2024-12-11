const Appointment = require('../models/Appointment');

// Récupérer tous les rendez-vous
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('employeeId', 'name email')
      .populate('serviceId', 'name duration price');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer un rendez-vous par ID
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('employeeId', 'name email')
      .populate('serviceId', 'name duration price');
    if (!appointment) return res.status(404).json({ message: 'Rendez-vous introuvable' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Créer un rendez-vous
const createAppointment = async (req, res) => {
  try {
    const { employeeId, clientName, serviceId, date, status } = req.body;
    const newAppointment = new Appointment({ employeeId, clientName, serviceId, date, status });
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Mettre à jour un rendez-vous
const updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAppointment) return res.status(404).json({ message: 'Rendez-vous introuvable' });
    res.json(updatedAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer un rendez-vous
const deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!deletedAppointment) return res.status(404).json({ message: 'Rendez-vous introuvable' });
    res.json({ message: 'Rendez-vous supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment };
