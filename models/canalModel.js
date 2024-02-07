const mongoose = require('mongoose');

const CanalSchema = new mongoose.Schema(
    {
        nom: {
            type: String,
        },
        nums: {
            type: [String],
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('canal', CanalSchema);