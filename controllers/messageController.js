const messageModel = require("../models/messageModel");
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.newMessage = async (req, res) => {
    console.log(req.body, " REQ BODY")
    try {
        const { senderId, recepientId, messageText, fileDirectory, type, time } = req.body;

        if (req.file) {
            const newMessage = await messageModel.create({
                senderId,
                recepientId,
                timestamps: new Date(),
                imageUrl: `api/${req.file.path}`,
                time: time,
                isRead: false
            })
            res.status(201).json(newMessage)
        } else {
            const newMessage = await messageModel.create({
                senderId,
                recepientId,
                messageText,
                timestamps: new Date(),
                type: type,
                fileDirectory: fileDirectory,
                time: time,
                isRead: false
            })
            res.status(201).json(newMessage)
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.updateUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            await UserModel.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $set: {
                        isRead: req.body.isRead,
                    }
                },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )
                .then((docs) => {
                    res.status(200).json(docs)
                })
                .catch((err) => { return res.status(500).send({ message: err }) })
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
};

module.exports.getAllMsgsByReceiveAndSender = async (req, res) => {
    try {
        const { senderId, recepientId } = req.params;
        const messages = await messageModel.find({
            $or: [
                { senderId: senderId, recepientId: recepientId },
                { senderId: recepientId, recepientId: senderId }
            ]
        }).populate('senderId', "_id pseudo");
        res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.deleteMessage = async (req, res) => {
    console.log(req.body)
    try {
        const { messages } = req.body;
        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ message: "Requête invalide" });
        } else {
            await messageModel.deleteMany({ _id: { $in: messages } });
            res.status(200).json({ message: "Message supprimé avec succès" });
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}
