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
        solde: {
            type: Number,
            default: 0
        },
        devise: {
            type: String,
            default: 'OBT'
        },
        pourcUsers: {
            type: [String],
        },
        pourcentage: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('compteUser', compteSchema);
