const listConnexion = require("../models/listConnexion");
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllConnexion = async (req, res) => {
    try {
        const connexions = await listConnexion.find();
        res.status(200).json(connexions);
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.getConnexionsByUserId = async (req, res) => {
    const userId = req.params.userId
    try {
        if (!ObjectID.isValid(userId)) {
            return res.status(400).send('ID inconnu : ' + userId)
        } else {
            const findConnexionsByUserId = await listConnexion.find({ userId: userId }).populate('pseudoBenef', "url pseudo");
            if (findConnexionsByUserId) {
                res.status(200).json(findConnexionsByUserId)
            } else {
                return res.status(404).json({ message: "Aucune connexion trouvée." })
            }
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.createConnexion = async (req, res) => {
    try {
        const { pseudoBenef } = req.body;
        let findConnexion = await listConnexion.findOne({ pseudoBenef: pseudoBenef });
        if (findConnexion) {
            findConnexion.status = 1;
            const newConnexion = await findConnexion.save();
            res.status(201).json(newConnexion)
        } else {
            let newConnexion = await listConnexion.create(req.body)
            res.status(201).json(newConnexion)
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.updateConnexion = async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            let connexionUpdate = await listConnexion.findByIdAndUpdate(
                { _id: id },
                req.body,
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );
            if (connexionUpdate) {
                res.status(200).json(connexionUpdate)
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    }
};

module.exports.delteConnexions = async (req, res) => {
    console.log(req.body)
    try {
        const id = req.params.id;
        await listConnexion.deleteOne({ _id: id });
        res.status(200).json({ message: "connexions supprimées avec succès" });
    } catch (error) {
        return res.status(500).json(error)
    }
}

