const Service = require('../models/Service');

// Récupérer tous les services
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer un service par ID
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service introuvable' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Créer un nouveau service
const createService = async (req, res) => {
  try {
    const { name, description, duration, price } = req.body;
    const newService = new Service({ name, description, duration, price });
    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Mettre à jour un service
const updateService = async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedService) return res.status(404).json({ message: 'Service introuvable' });
    res.json(updatedService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Supprimer un service
const deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) return res.status(404).json({ message: 'Service introuvable' });
    res.json({ message: 'Service supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllServices, getServiceById, createService, updateService, deleteService };
