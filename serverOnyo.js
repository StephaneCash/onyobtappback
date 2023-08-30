const express = require('express');
const app = express();
const http = require("http");
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server)

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
const repertoiresRoutes = require("./routes/repertoire.routes");

app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/comptes", comptesRoutes);
app.use('/api/codes-obt', codesObtRoutes);
app.use('/api/lives', liveRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/repertoires', repertoiresRoutes);

app.use("/api/uploads", express.static('./uploads'));

server.listen(process.env.PORT, () => {
    console.log("Le serveur tourne sur le port ", + process.env.PORT);
});


io.on('connection', (socket) => {
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log("User a rejoint la room ", room)
    });

    socket.on("sendMsg", (data) => {
        console.log(data , " MESSAGE")
        io.to(data.room).emit("newMessage", {
            _id: new Date().getTime(),
            ...data,
        })
    });

    socket.on("disconnect", () => {
        console.log("User deconnecté ", socket.id);
    })
})
