document.getElementById("new-room").addEventListener("click", () => {
    document.getElementById("new-room-form-div").classList.toggle("hide");
    document.getElementById("new-room").classList.toggle("hide");
})

document.getElementById("cancel-room-creation").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("new-room-form-div").classList.toggle("hide");
    document.getElementById("new-room").classList.toggle("hide");
})