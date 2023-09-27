const historiqueModel = require("../models/historiqueModel");
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.createHistorique = async (req, res) => {
    try {
        const historiques = await historiqueModel.create(req.body);
        console.log(req.body)
        res.status(200).json(historiques);
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.getAllHistoriquesByCalledIdByCallerId = async (req, res) => {
    try {
        const { callerId, calledId } = req.params;
        const historiques = await historiqueModel.find({
            $or: [
                { callerId: callerId, calledId: calledId },
                { callerId: calledId, calledId: callerId }
            ]
        }).populate('callerId', "_id pseudo");
        res.status(200).json(historiques);
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.getHistoriqueByCallerId = async (req, res) => {
    try {
        if (!ObjectID.isValid(req.params.id)) {
            return res.status(400).send('ID inconnu : ' + req.params.id)
        } else {
            const calledId = req.params.id;
            const historique = await historiqueModel.find({
                calledId: calledId
            }).populate('callerId', "_id pseudo url");

            if (historique) {
                res.status(200).json(historique)
            } else {
                return res.status(404).json({ message: "Aucune historique trouvée." })
            }
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.deleteHistorique = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        historiqueModel.findByIdAndRemove(req.params.id,)
            .then((docs) => {
                return res.status(200).send({
                    message: 'Historique supprimée avec succès',
                    data: docs
                })
            })
            .catch((err) => { return res.status(500).send({ message: err }) })
    }
}
