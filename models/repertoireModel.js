const mongoose = require('mongoose');

const repertoireSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            ref: "user"
        },
        num: {
            type: String,
            ref: "user"
        },
        bio: {
            type: String,
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('repertoire', repertoireSchema);
