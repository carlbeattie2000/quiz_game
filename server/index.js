const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const questionsAPI = require("./questions/questionsAPI")

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["http://127.0.0.1:5500", "http://192.168.0.3:8080"]
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

app.use("/", questionsAPI);

var users = {};
var usersScores = {}

io.on("connection", (socket) => {
    socket.on("join_room", (values) => {
        // set the rooms name
        socket.room = values[0]
        // set session values
        socket.request.session.username = values[1];

        if (users[socket.room+"_connectionLimit"] === undefined) {
            users[socket.room+"_connectionLimit"] = values[2]
        } else {
            if(users[socket.room].length > users[socket.room+"_connectionLimit"]) {
                socket.emit("room_full")
                return
            }
        }

        if (values[3] == 1 && users[socket.room] == undefined) return socket.emit("room_not_created");

        // add player to online players
        if (users[socket.room] == undefined) {
            users[socket.room] = []
            users[socket.room].push(socket.request.session.username);
        } else {
            if (users[socket.room].includes(socket.request.session.username)) return socket.emit("user_exists");
            users[socket.room].push(socket.request.session.username);
        }

        socket.join(socket.room); // join the new room name

        // join the room
        socket.emit("joined_room", {roomName: values[0], username: socket.request.session.username});

        io.to(socket.room).emit("new_user", users[socket.room]);
    })
    socket.on("start_quiz", (questions) => {
        var users_arr = []
        for (var user of users[socket.room]) {
            if (user != "host") {
                var userScore = {
                    "username": user,
                    "score": 0
                }
                users_arr.push(userScore);        
            } 
        }
        usersScores[socket.room] = users_arr;

        if (socket.request.session.username == "host") {
            socket.emit("quiz_started", {"userscores": usersScores[socket.room]});
        }
    })
})

// each new room, will generate a token will be stored in a database, and so only routes that have access to a token can access the API

httpServer.listen(3000);