const socket = io("http://localhost:3000");

document.getElementById("new-room-form").addEventListener("submit", (e) => {
    e.preventDefault();

    var roomName = document.getElementById("room-name").value;
    if (roomName.length > 12) {
        document.getElementById("room-name-error").innerText = "Name too long: max 12 chars"
        return
    };
    const roomPlayers = 3;
    const roomType = "Private";

    // create the new room card
    const HTML = `
        <div class="room">
            <button class="btn-main" id="${roomName}">Join Room</button>
            <span class="players">0/${roomPlayers}</span>
            <span class="type">${roomType}</span>
            <span class="room-name">${roomName}</span>
        </div>
    `
    socket.emit("room_created", HTML);

    document.body.addEventListener("click", (e) => {
        if (event.target.id == roomName) {
            const roomName = event.srcElement.id;
            socket.emit("join_room", roomName);
        }
    })
    
    hideRoomForm(); // need to connect or move from other file
})

const buildRoom = `
    <div class="new-room" id="new-room-form-div">
        <form id="new-room-form">
            <label for="questionAmount">Question Amount</label>
            <select id="questionsAmount">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
            </select>
            <button type="submit" class="btn-main">Create Room</button>
            <button id="cancel-room-creation" class="btn-main">Cancel</button>
        </form>
    </div>
`
// NOTE AND IMPORTANT ONE, THIS BUTTON WORKS ON BOTH CLIENTS PAGES SO THE OTHER BUTTON CAN AND MUST BE ABLE TO WORK TO JOIN ROOMS LOOK INTO IT

socket.on("connect", () => {
    console.log("You have successfully connected to the webSocket");
})

socket.on("joined_room", (roomName) => {
    console.log("You have joined the room", roomName)
    document.body.innerHTML = buildRoom;

    document.getElementById("start_game").addEventListener("click", () => {
        socket.emit("start_quiz");
    })
})

socket.on("quiz_started", (msg) => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", "http://localhost:3000/get-questions?amount=10&token=xxxbbbddd") // token will be created and stored when a new room is created and deleted once a room is closed
    xhr.type = "json";

    xhr.onload = () => {
        console.log(xhr.response);
    }
    
    xhr.send();
})

socket.on("room_created_confirmed", (HTML) => {
    const addNewRoomDiv = () => {
        // create new HTML element
        var roomsDiv = document.getElementById("top");
        roomsDiv.innerHTML += HTML;
    }
    addNewRoomDiv();
})


// idea, as i have not grasped webSockets yet, maybe i can have two options.
// one being create a new room, the other being enter room name to join
// that way its easier as i really suck at DOM and JS in general at the moment
// first person to join is host, and give a option to join as the screen display
// need to get hosts username so only host can start the game