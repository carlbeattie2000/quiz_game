const db = require("better-sqlite3")("./tokens.db");
const crypto = require("crypto");

db.prepare("CREATE TABLE IF NOT EXISTS api_tokens(token TEXT, expires INTEGER)").run();


function newToken() {
    // function that handles adding a new token to the database, then returns the token value.
    const authToken = crypto.randomBytes(20).toString("hex"); // generate a random string to act as the token
    
    db.prepare("INSERT INTO api_tokens (token, expires) VALUES (?, ?)").run(authToken, 10003404); // run a query that adds the token to the database.

    return authToken; // return the token
}

function checkToken(apiUrlToken) {
    // function that handles the auth/checking a token with a token parsed as an argument.
    const result = db.prepare("SELECT * FROM api_tokens").get(apiUrlToken); // query the database for the given token

    if (result) return result.token; // if found return the token

    return false // if not, return false
}

function removeToken(token) {
    // function to handle removing a token from the database
    db.prepare("DELETE FROM api_tokens WHERE token = ?").run(token); // query the database for the token and then remove it

    return
}

// once the user has called the function to start the quiz and the quiz question have been retrieved, we can remove the api_token from the database.