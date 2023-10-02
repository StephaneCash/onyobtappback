const mongoose = require('mongoose');

const compteSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            ref: "user"
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
        },
        pin: {
            type: String,
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('compteUser', compteSchema);
