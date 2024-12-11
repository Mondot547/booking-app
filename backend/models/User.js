const mongoose = require('mongoose');

const userShema = new mongoose.Schema({
    id: { type: Number },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
})

module.exports = mongoose.model('User', userShema);