const express = require('express');
const app = express();
require('dotenv').config({ path: './config/.env' });
const cors = require('cors');
const bodyParser = require('body-parser');

require('./config/db');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const usersRoutes = require("./routes/user.routes");
const postsRoutes = require("./routes/post.routes");
const comptesRoutes = require("./routes/compte.routes");
const codesObtRoutes = require("./routes/codesObt.routes");
const transactionsRoutes = require("./routes/transactions.routes");

app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/comptes", comptesRoutes);
app.use('/api/codes-obt', codesObtRoutes);

app.use("/api/uploads", express.static('./uploads'));

app.listen(process.env.PORT, () => {
    console.log("Le serveur tourne sur le port ", + process.env.PORT);
});