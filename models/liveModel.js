const mongoose = require('mongoose');

const liveSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        statusLive: {
            type: Boolean,
        },
        idLiveChannel: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('liveUser', liveSchema);
