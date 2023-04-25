const mongoose = require('mongoose');

const codesSchema = new mongoose.Schema(
    {
        content: {
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

module.exports = mongoose.model('code', codesSchema);