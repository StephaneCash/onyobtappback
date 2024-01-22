const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: String,
            required: true,
            ref: "user"
        },
        recepientId: {
            type: String,
            ref: "user"
        },
        messageType: {
            type: String,
            enum: ['text', "image"]
        },
        messageText: String,
        imageUrl: String,
        timestamps: String,
        type: String,
        fileDirectory: {
            type: String,
        },
        time: {
            type: String,
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('message', messageSchema);
