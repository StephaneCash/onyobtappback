const mongoose = require('mongoose');

const HistoriqueSchema = new mongoose.Schema(
    {
        calledId: {
            type: String,
            required: true,
            ref: "user"
        },
        callerId: {
            type: String,
            ref: "user"
        },
        status: {
            type: Number,
        },
        duree: {
            type: String,
        },
        type: {
            type: Number,
        },
        isType: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('historique', HistoriqueSchema);