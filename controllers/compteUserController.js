const compteModel = require("../models/compteModel");
const ObjectID = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');

module.exports.getAllComptes = async (req, res) => {
    try {
        const comptes = await compteModel.find().populate("userId", "_id url pseudo");
        res.status(200).json(comptes);
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.getUserById = async (req, res) => {
    try {
        if (!ObjectID.isValid(req.params.id)) {
            return res.status(400).send('ID inconnu : ' + req.params.id)
        } else {
            const userId = req.params.id;
            const findUserById = await compteModel.findOne({ userId: userId });
            if (findUserById) {
                res.status(200).json(findUserById)
            } else {
                return res.status(404).json({ message: "Aucun compte trouvé." })
            }
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.getAccountByNumero = async (req, res) => {
    try {
        const numero = req.params.id;

        const accountFind = await compteModel.findOne({ numero: numero }).populate('userId', "_id pseudo url")
        if (accountFind) {
            res.status(200).json(accountFind)
        } else {
            return res.status(404).json({ message: "Aucun compte trouvé." })
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.updateCompte = async (req, res) => {
    const id = req.params.id;
    const { pin } = req.body;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            if (pin) {
                if (pin.length >= 4 && pin.length <= 6) {
                    if (!/[a-z-A-Z]/.test(pin)) {
                        let salt = await bcrypt.genSalt();
                        let pinHash = await bcrypt.hash(req.body.pin, salt);
                        let compteUpdate = await compteModel.findByIdAndUpdate(
                            { _id: id },
                            { pin: pinHash },
                            { new: true, upsert: true, setDefaultsOnInsert: true }
                        );
                        if (compteUpdate) {
                            res.status(200).json(compteUpdate)
                        }
                    } else {
                        return res.status(400).json({ message: "Votre PIN ne peut pas contenir des lettres" })
                    }
                } else {
                    return res.status(400).json({ message: "Votre PIN doit avoir au minimum 4 caractères et max 6" })
                }
            } else {
                return res.status(400).json({ message: "PIN non défini" })
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    }
};

module.exports.comparePin = async (req, res) => {
    const { pin } = req.body;
    const id = req.params.id;
    try {
        if (pin) {
            const compte = await compteModel.findById(id);
            const isValid = await bcrypt.compare(pin, compte.pin);
            if (isValid) {
                res.status(200).json({ message: "PIN valide" });
            } else {
                res.status(400).json({ message: "PIN invalide" });
            }
        } else {
            return res.status(400).json({ message: "Veuillez entrer votre code PIN" })
        }
    } catch (err) {
        return res.status(500).json({ err });
    }
}

module.exports.rechargeCompte = async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            let { num } = req.body;
            let min = /[a-z]/g;
            if (num.length === 19) {
                if (min.test(num)) {
                    return res.status(400).json({ message: "Le numéro ne peut contenir de lettres minuscules" });
                } else {
                    let numSPlit = num && num.split('.');
                    let numIsValid = num && num.split('-');
                    if (numIsValid.length === 4) {
                        const findUserCompte = await compteModel.findOne({ userId: id });
                        let filter = { userId: id };

                        if (findUserCompte) {
                            await compteModel.updateOne(filter, { solde: parseFloat(findUserCompte.solde) + parseFloat(numSPlit[0]) });
                            res.status(200).json(
                                await compteModel.findOne({ _id: findUserCompte._id })
                            );
                        } else {
                            return res.status(404).json({ message: "Compte non trouvé." });
                        }
                    } else {
                        return res.status(400).json({ message: "Numéro incorrect." });
                    }
                }
            } else {
                return res.status(400).json({ message: "Numéro trop court soit trop long." });
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    }
};

module.exports.transfertObt = async (req, res) => {
    try {
        const { senderId, receivedId, montant } = req.body;

        const compteSender = await compteModel.findById(senderId);
        const compteReceived = await compteModel.findById(receivedId);

        console.log(req.body)

        const montantParse = parseInt(montant) + 1;

        if (compteSender.solde >=  montantParse) {
            const newCompteSender = await compteModel.findByIdAndUpdate(
                { _id: senderId },
                { solde: parseFloat(compteSender.solde) - parseInt(montant) },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );

            const newCompteReceived = await compteModel.findByIdAndUpdate(
                { _id: receivedId },
                { solde: parseFloat(compteReceived.solde) + parseInt(montant) },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );

            res.status(200).json(
                {
                    sender: newCompteSender,
                    received: newCompteReceived
                }
            );
        } else {
            return res.status(400).json({ message: "Votre solde est insuffisant pour effectuer ce transfert" })
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports.reduceCompte = async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            const findUserCompte = await compteModel.findOne({ userId: id });

            compteModel.findOneAndUpdate(
                { userId: req.params.id },
                {
                    $set: {
                        solde: findUserCompte.solde - 0.002
                    }
                },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )
                .then((docs) => {
                    res.status(200).json(docs)
                })
                .catch((err) => { return res.status(500).send({ message: err }) })

        } catch (error) {
            return res.status(500).json(error);
        }
    }
};

module.exports.addSoldeCompte = async (req, res) => {
    const id = req.params.id;
    const uid = req.body.uid;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            const findUserCompte = await compteModel.findOne({ userId: id });

            const data = await compteModel.findByIdAndUpdate(findUserCompte._id,
                { $addToSet: { pourcUsers: uid } },
                { new: true }
            )

            await compteModel.findOneAndUpdate(
                { userId: req.params.id },
                {
                    pourcentage: Number.parseFloat(data && data.pourcUsers && data.pourcUsers.length * 0.0005).toFixed(8)
                }
                ,
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )

        } catch (error) {
            return res.status(500).json(error);
        }
    }
};