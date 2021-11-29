const db = require("better-sqlite3")("./onlineUsers.db");

function createNewRoom(roomName) {
    db.prepare(`CREATE TABLE IF NOT EXISTS ${roomName} (username TEXT)`).run();
}

function joinRoom(roomName, username) {
    db.prepare(`INSERT INTO ${roomName} (username) VALUES (?)`).run(username);
}

function leaveRoom(roomName, username) {
    db.prepare(`DELETE FROM ${roomName} WHERE username = ?`).run(username);
}