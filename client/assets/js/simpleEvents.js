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

    console.log(apiURL);

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
        console.log(user)
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