const express = require("express");
const { NetworkAuthenticationRequire } = require("http-errors");
const { arrayBuffer } = require("stream/consumers");
const questionTest = require("./json/generalKnowledge.json");

var tokens = ["xxxbbbddd"]

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function wholeListRandom() {
    return questionTest.questions.sort( () => .5 - Math.random());
}

function getRandomQuestions(range) {
    const questions = questionTest.questions;
    const questionsArr = [];

    if (range > questions.length) return wholeListRandom()

    for(range; range > 0; range--) {
        questionsArr.push(questions[randomIntFromInterval(0, questions.length - 1)])
    }

    return questionsArr


}

getRandomQuestions(5)

const app = express();

app.get("/questions/easy/:amount/:token", (req, res) => {
    res.header("Content-Type", "application/json");
    console.log(req.url)
    if (!req.params.token in tokens) return false
    res.send(JSON.stringify(getRandomQuestions(req.params.amount), null, '\t'));
})

// each new room, will generate a token will be stored in a database, and so only routes that have access to a token can access the API

app.listen(3000);