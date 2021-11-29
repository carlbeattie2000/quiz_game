const socket = io("http://192.168.0.3:3000");

document.getElementById("new-room-form").addEventListener("submit", (e) => { // this event listener creates a new room with some options
    e.preventDefault();
    var username = document.getElementById("username").value;
    var roomName = document.getElementById("room-name").value;
    if (roomName.length > 12) {
        document.getElementById("room-name-error").innerText = "Name too long: max 12 chars"
        return
    };
    const roomPlayers = 3;
    const roomType = "Private";

    socket.emit("join_room", [roomName, username, roomPlayers]);
})

document.getElementById("join-room-form").addEventListener("submit", (e) => { // this event listener joins an existing room.
    e.preventDefault();

    var username = document.getElementById("username-join").value;
    var roomName = document.getElementById("join-room-name").value;
    if(roomName.length > 12) {
        document.getElementById("room-name-error").innerText = "Name too long: max 12 chars";
        return
    }

    socket.emit("join_room", [roomName, username, 0, 1]);
})

socket.on("connect", () => {
    console.log("You have successfully connected to the webSocket");
})

socket.on("joined_room", (data) => {
    console.log("You have joined the room", data.roomName)

    if (data.username != "host") {
        document.body.innerHTML = buildRoomClient;
    } else {
        document.body.innerHTML = buildRoom;

        document.getElementById("start-quiz-form").addEventListener("submit", (e) => {
            e.preventDefault();
            quizFormEvent();
        })
    }
})

socket.on("quiz_started", (usersScores) => {
    document.body.innerHTML = buildHostQuizPage;
    updateScoreBoard(usersScores);
})

socket.on("new_user", (users) => {
    const list = document.getElementById("quiz_lobby_list");
    list.innerHTML = "";
    for (var user of users) {
        const li = document.createElement("li");
        li.innerHTML = user;
        list.appendChild(li);
    }
})

socket.on("room_full", () => {
    alert("This room is currently full!");
})

socket.on("user_exists", () => {
    alert("This username is taken");
})

socket.on("room_not_created", () => {
    alert("This room does not exists, please create one first");
})

// idea, as i have not grasped webSockets yet, maybe i can have two options.
// one being create a new room, the other being enter room name to join
// that way its easier as i really suck at DOM and JS in general at the moment
// first person to join is host, and give a option to join as the screen display
// need to get hosts username so only host can start the game