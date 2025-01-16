const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '7d' } // Automatyczne usuwanie po 7 dniach
});

const RefreshTokenModel = mongoose.model('RefreshToken', refreshTokenSchema);
module.exports = RefreshTokenModel;