const mongoose = require("mongoose");

mongoose
    .connect(
        "mongodb://localhost:27017/onyobt",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => {
        console.log('Connexion successful à la DB')
    }).catch(err => {
        console.log('Connexion impossible à la DB', err)
    })