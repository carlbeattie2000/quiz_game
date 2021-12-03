// new room form display/hide
document.getElementById("openNewRoomForm").addEventListener("click", () => {
    document.getElementById("newRoomForm").classList.toggle("hidden");
    document.getElementById("openNewRoomForm").classList.toggle("hidden");
    document.getElementById("openJoinRoomForm").classList.toggle("hidden");
})

document.getElementById("hideRoom").addEventListener("click", (e) => {
    e.preventDefault();

    document.getElementById("newRoomForm").classList.toggle("hidden");
    document.getElementById("openNewRoomForm").classList.toggle("hidden");
    document.getElementById("openJoinRoomForm").classList.toggle("hidden");
})

// join room form display/hide
document.getElementById("openJoinRoomForm").addEventListener("click", () => {
    document.getElementById("joinRoomForm").classList.toggle("hidden");
    document.getElementById("openJoinRoomForm").classList.toggle("hidden");
    document.getElementById("openNewRoomForm").classList.toggle("hidden");
})

document.getElementById("hideRoomJoin").addEventListener("click", (e) => {
    e.preventDefault();

    document.getElementById("joinRoomForm").classList.toggle("hidden");
    document.getElementById("openJoinRoomForm").classList.toggle("hidden");
    document.getElementById("openNewRoomForm").classList.toggle("hidden");

})

function quizFormEvent() {
    const questionAmount = document.getElementById("questionsAmount").value;
    const questionsCategory = document.getElementById("questionsCategory").value;
    const questionsDifficulty = document.getElementById("questionDifficulty").value;

    var apiURL = "http://192.168.0.3:3000/get-questions?token=xxxbbbddd"

    const xhr = new XMLHttpRequest();

    if (questionsCategory != "") {
        apiURL += `&category=${questionsCategory}`;
    }

    if (questionsDifficulty != "") {
        apiURL += `&difficulty=${questionsDifficulty}`;
    }

    apiURL += `&amount=${questionAmount}`;

    xhr.open("GET", apiURL, true) // token will be created and stored when a new room is created and deleted once a room is closed
    xhr.type = "json";

    xhr.onload = () => {
        socket.emit("start_quiz", xhr.response)
    }
    
    xhr.send();
}

const updateScoreBoard = (users) => {
    const mainDiv = document.getElementById("score_board");
    mainDiv.innerHTML = "";
    
    for (var user of users.userscores) {
        const new_span = document.createElement("span");
        new_span.innerHTML = user.username + "  ::  " + user.score;
        new_span.classList.add("score");
        mainDiv.appendChild(new_span);
    }
}

function randomizeArray(options) {
    tmp_arr = [];

    for (var option of options) {
        tmp_arr.push(option)
    }

    return tmp_arr.sort( () => .5 - Math.random() );
}

function addOptionButtons(options) {
    var mainDiv = document.getElementById("options_section");

    options = randomizeArray(options);

    var optionsNumber = 0;

    for (var option of options) {
        var button = document.createElement("button");
        button.value = option;
        button.innerHTML = option;
        button.classList.add("btn");
        button.classList.add("btn-questions");
        button.id = optionsNumber;
        mainDiv.appendChild(button);
        optionsNumber++;
    }

}

function getButtonsArray(correct_answer) {
    const buttons_arr = document.querySelectorAll(".btn-questions");
    
    for (var button of buttons_arr) {
        if (button.value == correct_answer) {
            button.style.backgroundColor = "green";
        }
    }
}

function setHostQuestion(question) {
    var questionDiv = document.getElementById("question-div");
    questionDiv.innerHTML = "";
    var h1 = document.createElement("h1")
    h1.innerHTML = question;
    questionDiv.appendChild(h1);
}

function addAnswerClickListener() {
    document.getElementById("0").addEventListener("click", (e) => {
        e.preventDefault();
        // option a
        var answer = document.getElementById("0");
        answer.classList.add("btn-locked");
        userLockAnswer(answer.value);
    })
    document.getElementById("1").addEventListener("click", (e) => {
        e.preventDefault();
        // option b
        var answer = document.getElementById("1");
        answer.classList.add("btn-locked");
        userLockAnswer(answer.value);
    })
    document.getElementById("2").addEventListener("click", (e) => {
        e.preventDefault();
        // option c
        var answer = document.getElementById("2");
        answer.classList.add("btn-locked");
        userLockAnswer(answer.value);
    })
    document.getElementById("3").addEventListener("click", (e) => {
        e.preventDefault();
        // option d
        var answer = document.getElementById("3");
        answer.classList.add("btn-locked");
        userLockAnswer(answer.value);
    })
}

function disabledAllButtons() {
    document.getElementById("0").disabled = true;
    document.getElementById("1").disabled = true;
    document.getElementById("2").disabled = true;
    document.getElementById("3").disabled = true;
}

function userLockAnswer(answer) {
    socket.emit("answer_locked_server", answer);
}

function showLeaderboard() {
    var main_div = document.getElementById("question-div");
    main_div.innerHTML = buildHostLeaderboard;
    document.getElementById("end_game").addEventListener("click", () => {
        socket.emit("leave_room");
    })
}

function addResultsToLeaderboard(results) {
    var table = document.getElementById("leaderboard-table");
    for (var result of results) {
        var table_row = document.createElement("tr");

        var table_content_one = document.createElement("td");
        table_content_one.innerHTML = result[0];

        var table_content_two = document.createElement("td");
        table_content_two.innerHTML = result[1];

        var table_content_three = document.createElement("td");
        table_content_three.innerHTML = result[2];

        var table_content_four = document.createElement("td");
        table_content_four.innerHTML = result[3];

        table_row.append(table_content_one);
        table_row.append(table_content_two);
        table_row.append(table_content_three);
        table_row.append(table_content_four);

        table.appendChild(table_row);
    }
}