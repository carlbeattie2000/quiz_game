const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const questionsAPI = require("./questions/questionsAPI");

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: ["http://127.0.0.1:5500", "http://192.168.0.3:8080"]
    }
});

var sessionMiddleware = (
    require("express-session") ({
        secret: "fffgggxxxx",
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        },
        resave: true,
        saveUninitialized: true,
    })
);

io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
});

app.use("/", questionsAPI);

// local storage for question rooms
var users = {},
    usersScores = {},
    usersGameLeaderboard = {},
    roomQuestions = {},
    roundQuestionCount = {},
    roomHostId = {},
    roomUsersIds = {},
    roomRoundQuestion = {},
    usersRoundAnswers = {};

io.on("connection", (socket) => {
    socket.on("join_room", (data) => {
        // set the rooms name
        socket.room = data[0];

        // set the session username
        socket.request.session.username = data[1];
        // username quick accesses
        var username = socket.request.session.username;

        // limit the users connected to what is set by the host
        if (users[socket.room+"_connectionLimit"] === undefined) {
            users[socket.room+"_connectionLimit"] = data[2];
        } else {
            if (users[socket.room].length > users[socket.room+"_connectionLimit"]) {
                socket.emit("room_full");
            }
        }

        // check if the room exists before a normal user can join the room
        if (data[3] === 1 && users[socket.room] === undefined) {
            return socket.emit("room_not_created");
        }

        // add player to waiting in lobby
        if (users[socket.room] === undefined) {
            users[socket.room] = []; // create new empty array for storing the users
            users[socket.room].push(username); // set the users username into there session

            roomHostId[socket.room] = socket.id; // set the hostsID as the host will be the first one to connect this wont be called again so it works.
        } else {
            if (users[socket.room].includes(username)) {
                return socket.emit("user_exists");
            }

            if (roomUsersIds[socket.room] === undefined) {
                roomUsersIds[socket.room] = []
            }
            roomUsersIds[socket.room].push(socket.id);

            users[socket.room].push(username)
        }

        socket.join(socket.room) // allow the user to join the room

        socket.emit("joined_room", {roomName: socket.room, username: username});

        io.to(socket.room).emit("new_user", users[socket.room]) // update the lobby players list
    })

    socket.on("start_quiz", (question) => {
        roomQuestions[socket.room] = JSON.parse(question);
        roundQuestionCount[socket.room] = 0;
        io.to(socket.room).emit("quiz_started");
        socket.emit("round_end"); // this should not be here but only way i can get it to work
    })

    socket.on("start_quiz_global", () => {
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


        socket.emit("client_quiz_begin", {"userscores": usersScores[socket.room], username: socket.request.session.username});
    })

    socket.on("next_round_server", () => {
        roomRoundQuestion[socket.room] = roomQuestions[socket.room][roundQuestionCount[socket.room]];

        roundQuestionCount[socket.room] += 1;

        usersRoundAnswers = {};
    })
    
    socket.on("get_current_round", () => {
        if (roundQuestionCount[socket.room] > roomQuestions[socket.room].length) {
            io.to(roomHostId[socket.room]).emit("results_screen", usersGameLeaderboard[socket.room]);
            return
        }

        for (var user of roomUsersIds[socket.room]) {
            io.to(user).emit("next_round_client", roomRoundQuestion[socket.room].answer_options)
        }

        io.to(roomHostId[socket.room]).emit("host_next_question", roomRoundQuestion[socket.room].question);
    })

    socket.on("answer_locked_server", (answer) => {
        // socket event that takes the users locked answer and then once everyone has submitted there answer it does some checks
        // add scores to whoever is correct
        // saves the users question, answer and if it was correct or not in a leaderboard dict 
        // and then moves on to the next question
        if (usersGameLeaderboard[socket.room] === undefined) { // if the dict to store the users results in does not exists, create a new dict object that equals an array
            usersGameLeaderboard[socket.room] = [];
        }

        usersRoundAnswers[socket.request.session.username] = answer; // Get the users answer
        // need to get the length of answers answered in usersRoundAnswers
        var tmp_arr = []; 
        for (user of users[socket.room]) {
            for (const key of Object.keys(usersRoundAnswers)) {
                if (key === user) {
                    tmp_arr.push([key, usersRoundAnswers[key]]);
                }
            }
        }

        socket.emit("answer_locked_client");

        // now need check if everyone has answered
        if (tmp_arr.length >= users[socket.room].length - 1) {
            // check who answered correctly
            var scr_arr = [];
            for (var user of tmp_arr) {
                var correct = false;
                if (user[1] === roomRoundQuestion[socket.room].correct_answer) {
                    scr_arr.push(user[0]);
                    correct = true;
                }

                usersGameLeaderboard[socket.room].push([roomRoundQuestion[socket.room].question, user[0], user[1], correct]);
            }
            // if the user was correct add a point to there score.
            for (var userScore of usersScores[socket.room]) {
                if (scr_arr.includes(userScore.username)) {
                    userScore.score +=1;
                }
            };

            // emit this too the host
            io.to(roomHostId[socket.room]).emit("update_score", {"userscores": usersScores[socket.room]});

            // wait 4 seconds before moving on to the next question.
            setTimeout(
                () => {
                    socket.emit("round_end");
                },
                4 * 1000
            );
            
        }
    })
})

httpServer.listen(3000);

//TODO: Line 58 throws an error sometimes on some instances need to fix
//TODO: need to have a restart option at the end of an round that redisplays the quiz menu
//TODO: Save the players chosen answer for that round, and once everyone has chosen an answer display the correct answers by highlighting it green and underneath the question on the host screen display who guess correct answer
//TODO: API is getting dupes