const mongoose = require('mongoose');

const compteSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        numero: {
            type: String,
            trim: true,
            required: true
        },
        isActive: Boolean,
        solde: Number,
        devise: {
            type: String,
            default: 'OBT'
        },
        pourcentage: {
            type: Number
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('compteUser', compteSchema);