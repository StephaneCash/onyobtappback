const mongoose = require('mongoose');

const TransactionsSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        montant: {
            type: Number,
            trim: true,
            required: true
        },
        type: {
            type: String,
        },
        devise: {
            type: String,
        },
        statut: Boolean,
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('transaction', TransactionsSchema);