const messageModel = require("../models/messageModel");
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.newMessage = async (req, res) => {
    try {
        const { senderId, recepientId, messageText } = req.body;
        const newMessage =  messageModel.create({
            senderId,
            recepientId,
            messageText,
            timestamps: new Date(),
        })
        res.status(201).json(newMessage)
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.getAllMsgsByReceiveAndSender = async (req, res) => {
    try {
        
        const { senderId, recepientId } = req.body;
        const messages = await messageModel.findOne({
            $or: [
                {senderId: senderId, recepientId: recepientId},
                {senderId: recepientId, recepientId: senderId}
            ]
        });
        res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json(error)
    }
}