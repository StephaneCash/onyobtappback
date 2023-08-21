const repertoireModel = require("../models/repertoireModel");
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.createRep = async (req, res) => {
    try {
        let newRep = await repertoireModel.create(req.body)
        res.status(201).json(newRep)
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.getAllNums = async (req, res) => {
    try {
        const nums = await repertoireModel.find().populate('userId', "_id pseudo url");
        res.status(200).json(nums);
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.getOneNum = async (req, res) => {
    try {
        if (!ObjectID.isValid(req.params.id)) {
            return res.status(400).send('ID inconnu : ' + req.params.id)
        } else {
            const userId = req.params.id;
            const findUserById = await repertoireModel.findOne({ userId: userId });
            if (findUserById) {
                res.status(200).json(findUserById)
            } else {
                return res.status(404).json({ message: "Aucun repertoire trouvé." })
            }
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.updateNum = async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            let updateRep = await repertoireModel.findByIdAndUpdate(
                { _id: id },
                req.body,
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );
            if (updateRep) {
                res.status(200).json(updateRep)
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    }
};

module.exports.deleteRep = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        repertoireModel.findByIdAndDelete(req.params.id,)
            .then((docs) => {
                return res.status(200).send({
                    message: 'Repertoire supprimé avec succès',
                    data: docs
                })
            })
            .catch((err) => { return res.status(500).send({ message: err }) })
    }
}
