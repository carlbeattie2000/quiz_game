const socket = io("http://192.168.0.3:3000");
const mainSection = document.getElementById("mainWindow");

document.getElementById("new-room-form").addEventListener("submit", (e) => { // this event listener creates a new room with some options
    e.preventDefault();
    var username = document.getElementById("username").value;
    var roomName = document.getElementById("roomName").value;
    const roomPlayers = 3;

    socket.emit("join_room", [roomName, username, roomPlayers]);
})

document.getElementById("join-room-form").addEventListener("submit", (e) => { // this event listener joins an existing room.
    e.preventDefault();

    var username = document.getElementById("username-join").value;
    var roomName = document.getElementById("joinRoomName").value;

    socket.emit("join_room", [roomName, username, 0, 1]);
})

socket.on("connect", () => {
    console.log("You have successfully connected to the webSocket");
})

socket.on("joined_room", (data) => {
    console.log("You have joined the room", data.roomName)

    if (data.username != "host") {
        mainSection.innerHTML = buildRoomClient;
    } else {
        mainSection.innerHTML = buildRoom;
        document.getElementById("start-quiz-form").addEventListener("submit", (e) => {
            e.preventDefault();
            quizFormEvent();
        })
    }
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

socket.on("quiz_started", () => {
    socket.emit("start_quiz_global");
})

socket.on("client_quiz_begin", (userInfo) => {
    if (userInfo.username == "host") {
        mainSection.innerHTML = buildHostQuizPage;
        updateScoreBoard(userInfo);
        return
    }
})

socket.on("answer_locked_client", () => {
    disabledAllButtons();
    //TODO: add message telling user there answer is locked
})

socket.on("round_end", () => {
    socket.emit("next_round_server");
    socket.emit("get_current_round");
})

socket.on("next_round_client", (options) => {
    mainSection.innerHTML = buildClientQuizPage;
    addOptionButtons(options)
    addAnswerClickListener();
})

socket.on("show_correct_answer", (correct_answer) => {
    // need to highlight the correct answer with a green background
    getButtonsArray(correct_answer);
})

// host

socket.on("host_next_question", (question) => {
    setHostQuestion(question);
})

socket.on("update_score", (new_score) => {
    updateScoreBoard(new_score);
})

socket.on("results_screen", (results) => {
    // display the quiz results
    showLeaderboard();
    addResultsToLeaderboard(results);
})

socket.on("main_menu", () => {
    location.reload();
})