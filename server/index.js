const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const questionsAPI = require("./questions/questionsAPI")

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://127.0.0.1:5500"
    }
});

var hostName = "";

app.use("/", questionsAPI);

io.on("connection", (socket) => {
    socket.on("join_room", (roomName) => {
        socket.join(roomName);
        hostName = roomName;
        socket.emit("joined_room", roomName);
    })
    socket.on("start_quiz", () => {
        io.emit("quiz_started");
    })
    socket.on("room_created", (HTML) => {
        io.emit("room_created_confirmed", HTML);
    })
})

// each new room, will generate a token will be stored in a database, and so only routes that have access to a token can access the API

httpServer.listen(3000);