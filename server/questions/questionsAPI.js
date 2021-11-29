const express = require("express");

const cors = require('cors');

var corsOptions = {
    origin: 'http://127.0.0.1:5500',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


const getQuestions = require("./getQuestionsFunctions")

const api = express.Router();

var tokens = ["xxxbbbddd"];

api.get("/get-questions", cors(corsOptions), (req, res) => {
    // querys
    var amount = req.query.amount;
    var category = req.query.category
    var difficulty = req.query.difficulty;
    var token = req.query.token;

    res.header("Content-Type", "application/json");

    if (!amount) amount = 99999999; // gets every question
    else
        amount = amount;

    if (!tokens.includes(token)) return res.send(JSON.stringify({"response": 401, "error": "auth_token_failed", "more details": "missing API key, please make sure you are in a game."}, null, '\t'));

    res.send(JSON.stringify(getQuestions.getRandomQuestions(amount, category, difficulty), null, '\t'));
})

module.exports = api;

// what do i need to do
// allow users to create rooms to host there quiz
// option to make the room private/public
// private ones have a unique URL, which allows them to invite there friends to join
// host selects category, difficulty and amount
// score board during the quiz, and saves to users account as a kinda leader board
// add enough questions so questions wont be that repeated
// host can lock the room (once all friends are in the room, can stop connects)

// planned
// kick ban users from your room
// turn into a simple mobile app
// The get-questions route has an Request limit of 5 per 30 minutes (if a user is sending more than this, he is using for his own site)
// API Key for get-questions starting at $1.50 per 200 requests