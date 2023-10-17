const mongoose = require('mongoose');

const ListConnexion = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        pseudoBenef: {
            type: String,
            ref: "user"
        },
        numeroBenef: {
            type: String,
        },
        code: {
            type: String,
        },
        status: {
            type: Number,
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('listconnexion', ListConnexion);