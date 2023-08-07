const liveModel = require("../models/liveModel");
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllLives = async (req, res) => {
    try {
        const lives = await liveModel.find();
        res.status(200).json(lives);
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.getOneLiveByIdUser = async (req, res) => {
    try {
        if (!ObjectID.isValid(req.params.id)) {
            return res.status(400).send('ID inconnu : ' + req.params.id)
        } else {
            const userId = req.params.id;
            const findUserById = await liveModel.findOne({ userId: userId });
            if (findUserById) {
                res.status(200).json(findUserById)
            } else {
                return res.status(404).json({ message: "Aucun live user trouvé." })
            }
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.createLive = async (req, res) => {
    try {
        let newLive = await liveModel.create(req.body)
        res.status(201).json(newLive)
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.updateLive = async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            let updateLive = await liveModel.findByIdAndUpdate(
                { _id: id },
                req.body,
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );
            if (updateLive) {
                res.status(200).json(updateLive)
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    }
};

module.exports.deleteLive = async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            let liveDeleted = await liveModel.deleteOne(
                { userId: id }
            ).exec()
            if (liveDeleted) {
                res.status(200).json(liveDeleted)
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}
