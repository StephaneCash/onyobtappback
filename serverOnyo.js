const express = require('express');
const app = express();
const http = require("http");
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server)

require('dotenv').config({ path: './config/.env' });
const cors = require('cors');

require('./config/db');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(cors());
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
const historiquesRoutes = require("./routes/historique.routes");
const connexionsRoutes = require("./routes/connexions.routes");

app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/comptes", comptesRoutes);
app.use('/api/codes-obt', codesObtRoutes);
app.use('/api/lives', liveRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/repertoires', repertoiresRoutes);
app.use('/api/historiques', historiquesRoutes);
app.use('/api/connexions', connexionsRoutes);

app.use("/api/uploads", express.static('./uploads'));
app.use("/api/images", express.static('./images'));

server.listen(5012, () => {
    console.log("Le serveur tourne sur le port ", + process.env.PORT);
});


io.on('connection', (socket) => {
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log("User a rejoint la room ", room)
    });

    socket.on("sendMsg", (data) => {
        io.to(data.room).emit("newMessage", {
            _id: new Date().getTime(),
            ...data,
        })
    });

    socket.on('userWrite', (data) => {
        io.to(data.room).emit("userWriteSignal", {
            _id: new Date().getTime(),
            ...data,
        })
    })

    socket.on("newAppel", (data) => {
        io.to(data.room).emit("newAppelEntrant", data)
    });

    socket.on("stopAppel", (data) => {
        io.to(data.room).emit("stopAppelEmit", data)
    });

    socket.on("acceptCallVoice", (data) => {
        io.to(data.room).emit("acceptCallVoiceEmit", data)
    });

    socket.on("acceptCallVideo", (data) => {
        io.to(data.room).emit("acceptCallVideoEmit", data)
    })

    socket.on("newAppelVideo", (data) => {
        io.to(data.room).emit("newVideoAppel", data);
    });

    socket.on("stopAppelVideo", (data) => {
        io.to(data.room).emit("stopAppelVideoEmit", data)
    });

    socket.on("transfertData", (data) => {
        io.to(data.room).emit("newCompteTransfert", data)
    });

    socket.on("connexionHand", (data) => {
        io.to(data.room).emit("connexionHandCompte", data)
    });

    socket.on("soldeNewCompte", (data) => {
        io.to(data.room).emit("soldeNewCompteData", data)
    });

    socket.on("newPostFile", (data) => {
        io.to(data.room).emit("newPost", data)
    });

    socket.on("usersModified", (data) => {
        io.to(data.room).emit("usersEmit", data)
    });

    socket.on("demandeRejoindreLive", (data) => {
        io.to(data.room).emit("reponseLiveJoind", data)
    });

    socket.on("newAppelGroup", (data) => {
        console.log("APPE GROUPE")
        console.log(data)
        io.to(data.room).emit("emitAppelGroup", data)
    });

    socket.on("disconnect", () => {
        console.log("User deconnecté ", socket.id);
    })
})
