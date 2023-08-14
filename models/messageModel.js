const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: String,
            required: true
        },
        recepientId: {
            type: String,
        },
        messageType: {
            type: String,
            enum: ['text', "image"]
        },
        messageText: String,
        imageUrl: String,
        timestamps: String
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('message', messageSchema);
