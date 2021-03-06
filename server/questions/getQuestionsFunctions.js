const questionTest = require("./questions_json/questions_part_1.json");

const randomIntFromInterval = (min, max) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const getTheRandomQuestionsList = (range, questionsArr) => {

    const new_arr = []

    if (range > questionsArr.length) return questionsArr.sort( () => .5 - Math.random());

    questionsArr = questionsArr.sort(() => .5 - Math.random());

    for(range; range > 0; range--) {
        new_arr.push(questionsArr[range]);
    }

    return new_arr
}

const filterByCategory = (array, category) => {
    var questionArr = [];

    for (var item of array) {
        if (item.category == category) questionArr.push(item);
    }

    return questionArr
}

const filterByDifficulty = (array, difficulty) => {
    var questionArr = [];

    for(var item of array) {
        if (item.difficultly == difficulty) questionArr.push(item);
    }

    return questionArr
}

exports.getRandomQuestions = (range, category, difficulty) => {
    var questionArr = questionTest.questions;

    if (category) questionArr = filterByCategory(questionArr, category);
    if (difficulty) questionArr = filterByDifficulty(questionArr, difficulty);

    questionArr = getTheRandomQuestionsList(range, questionArr);

    return questionArr
}