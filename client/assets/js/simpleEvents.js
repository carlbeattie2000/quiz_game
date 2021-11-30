document.getElementById("new-room").addEventListener("click", () => {
    document.getElementById("new-room-form-div").classList.toggle("hide");
    document.getElementById("new-room").classList.toggle("hide");
})

document.getElementById("cancel-room-creation").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("new-room-form-div").classList.toggle("hide");
    document.getElementById("new-room").classList.toggle("hide");
})

document.getElementById("join-room").addEventListener("click", () => {
    document.getElementById("join-room-form-div").classList.toggle("hide");
    document.getElementById("join-room").classList.toggle("hide");
})

document.getElementById("cancel-join").addEventListener("click", (e) => {
    e.preventDefault();
    
    document.getElementById("join-room-form-div").classList.toggle("hide");
    document.getElementById("join-room").classList.toggle("hide");
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
        const containerDiv = document.createElement("div");
        containerDiv.classList.add("score_card");

        const firstDiv = document.createElement("div");
        firstDiv.classList.add("score_player_name");
        firstDiv.innerHTML = user.username; // the users name

        const secondDiv = document.createElement("div");
        secondDiv.classList.add("score_main");
        secondDiv.innerHTML = user.score; // get the score

        containerDiv.appendChild(firstDiv);
        containerDiv.appendChild(secondDiv);

        mainDiv.appendChild(containerDiv);
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
        var button = document.createElement("INPUT");
        button.value = option;
        button.classList.add("btn-main");
        button.id = optionsNumber;
        mainDiv.appendChild(button);
        optionsNumber++;
    }

}

function setHostQuestion(question) {
    var questionDiv = document.getElementById("question-div");
    questionDiv.innerHTML = "";
    var h3 = document.createElement("h3")
    h3.innerHTML = question;
    questionDiv.appendChild(h3);
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