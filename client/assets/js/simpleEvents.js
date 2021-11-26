document.getElementById("new-room").addEventListener("click", () => {
    document.getElementById("new-room-form-div").classList.toggle("hide");
    document.getElementById("new-room").classList.toggle("hide");
})

document.getElementById("cancel-room-creation").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("new-room-form-div").classList.toggle("hide");
    document.getElementById("new-room").classList.toggle("hide");
})

document.getElementById("new-room-form").addEventListener("submit", (e) => {
    e.preventDefault();

    var roomName = document.getElementById("room-name").value;
    if (roomName.length > 12) {
        document.getElementById("room-name-error").innerText = "Name too long: max 12 chars"
        return
    };
    var roomType = document.getElementById("roomType").value;
    var roomPlayers = document.getElementById("max-players").value;
    var roomsDiv = document.getElementById("top");

    // create the new room card
    const HTML = `
        <div class="room">
            <button class="btn-main">Join Room</button>
            <span class="players">0/${roomPlayers}</span>
            <span class="type">${roomType}</span>
            <span class="room-name">${roomName}</span>
        </div>
    `
    roomsDiv.innerHTML += HTML;
    
    hideRoomForm();
})