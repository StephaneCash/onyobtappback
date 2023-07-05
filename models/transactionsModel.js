const mongoose = require('mongoose');

const TransactionsSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        montant: {
            type: String,
            trim: true,
            required: true
        },
        statut: Boolean,
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('transaction', TransactionsSchema);