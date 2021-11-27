const express = require("express");
const questionsAPI = require("./questions/questionsAPI")

const app = express();

app.use("/", questionsAPI);

// each new room, will generate a token will be stored in a database, and so only routes that have access to a token can access the API

app.listen(3000);