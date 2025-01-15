const mongoose = require('mongoose');

const ConversionHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fromCurrency: { type: String, required: true },
    toCurrency: { type: String, required: true },
    amount: { type: Number, required: true },
    convertedAmount: { type: Number, required: true },
    conversionRate: { type: Number, required: true },
    conversionDate: { type: Date, default: Date.now }
});

const ConversionHistoryModel = mongoose.model("ConversionHistory", ConversionHistorySchema);
module.exports = ConversionHistoryModel;