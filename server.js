const express = require('express');
const app = express();
const http = require("http")
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

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
const liveRoutes = require("./routes/lives.routes");
const messagesRoutes = require("./routes/messages.routes");

app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/comptes", comptesRoutes);
app.use('/api/codes-obt', codesObtRoutes);
app.use('/api/lives', liveRoutes);
app.use('/api/messages', messagesRoutes);

app.use("/api/uploads", express.static('./uploads'));

io.on("connection", (socket) => {
    console.log("Un user s'est connecté");

    socket.on('send_message', (data) => {
        io.emit('received_message', data)
    });

    socket.on('disconnect', () => {
        console.log("Un user s'est déconnecté");
    });
})

server.listen(process.env.PORT, () => {
    console.log("Le serveur tourne sur le port ", + process.env.PORT);
});