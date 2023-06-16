const compteModel = require("../models/compteModel");
const ObjectID = require('mongoose').Types.ObjectId;

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

module.exports.updateCompte = async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            let compteUpdate = await compteModel.findByIdAndUpdate(
                { _id: id },
                req.body,
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );
            if (compteUpdate) {
                res.status(200).json(compteUpdate)
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    }
};

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


module.exports.reduceCompte = async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            const { num } = req.body;
            if (num) {
                const findUserCompte = await compteModel.findOne({ userId: id });
                let filter = { userId: id };

                if (findUserCompte) {
                    if (parseFloat(findUserCompte.solde) > 1) {
                        if (parseFloat(findUserCompte.solde) - parseFloat(num) >= 1) {
                            await compteModel.updateOne(filter, { solde: parseFloat(findUserCompte.solde) - parseFloat(num) });
                            res.status(200).json(
                                await compteModel.findOne({ _id: findUserCompte._id })
                            );
                        } else {
                            return res.status(400).json({ message: "Solde insuffisant." });
                        }
                    } else {
                        return res.status(400).json({ message: "Solde insuffisant." });
                    }
                } else {
                    return res.status(404).json({ message: "Compte non trouvé." });
                }
            } else {
                return res.status(400).json({ message: "Veuillez fournir la valeur de number" })
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    }
};

module.exports.addSoldeCompte = async (req, res) => {
    const { num } = req.body;
    const numFloat = parseFloat(num);
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            if (numFloat) {
                const findUserCompte = await compteModel.findOne({ userId: id });
                let filter = { userId: id };

                if (findUserCompte) {
                    await compteModel.updateOne(filter, { pourcentage: findUserCompte.pourcentage + numFloat });
                    res.status(200).json(
                        await compteModel.findOne({ _id: findUserCompte._id })
                    );
                } else {
                    return res.status(404).json({ message: "Compte non trouvé." });
                }
            } else {
                return res.status(400).json({ message: "Veuillez fournir la valeur de number" })
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    }
};