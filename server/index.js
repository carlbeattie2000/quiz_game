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

var sessionMiddleware = (
    require("express-session")({
      secret: "fhdfhdjhfdjfh4r458745rhfgjghfjhgfhfgjfgh",
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Save the session for 1 day || add * n to save it for n number of days. 
      },
      resave: true,
      saveUninitialized: true,
    })
);

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
});

var hostName = "";

app.use("/", questionsAPI);

io.on("connection", (socket) => {
    socket.on("join_room", (values) => {
        socket.join(values[0]);
        hostName = values[0];
        io.emit("joined_room", values[0]);
        io.emit("new_user", values[1]);
        socket.request.session.username = values[1];
    })
    socket.on("start_quiz", () => {
        io.emit("quiz_started");
    })
    socket.on("log_username", () => {
        socket.emit("log_username", socket.request.session.username);
    })
})

// each new room, will generate a token will be stored in a database, and so only routes that have access to a token can access the API

httpServer.listen(3000);