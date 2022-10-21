import { Q_A_Array } from "./answers.js"
import * as levenshtein from 'fast-levenshtein';
// get the question
let main = document.querySelector('#main');
const questionInnerText = main.querySelector("#assessment-a11y-title").innerText;
let question = questionInnerText.split('\n')[0];
console.log(question.split("\n")[0]);
let answerLength = main.getElementsByTagName("li").length
let possibilities = []
for (let i = 0; i < answerLength; i++){
    let possibility = main.querySelector(`#skill-assessment-quiz-${i} `).innerText;
    // remove second line in possibility
    possibility = possibility.split("\n")[0];
    possibility.trim()
    possibilities.push(possibility)
    console.log(`Possibility: ${possibility}`)
}

// find the answer in ../answers.md
let lines = Q_A_Array;
// find the line with the shortest levenstein distance to the question in the answers.md 
let answer = "";
let minDistance = 1000;
for (let i = 0; i < lines.length; i++){
    let line = lines[i];
    if (line.includes("####")){
        let distance = levenshtein.get(question, line);
        if (distance < minDistance){
            minDistance = distance;
            answer = lines[i+1];
        }
    }
}
// verify that the answer is correct
if(answer.includes("x")){
    // find the most probable answer
    let minDistancePossibilities = 1000;
    let answerIndex = 0;
    let i = 0;
    for (const possibilitie of possibilities)
    {
        let distance = levenshtein.get(answer, possibilitie);
        if (distance < minDistancePossibilities){
            minDistancePossibilities = distance;
            answer = possibilitie;
            answerIndex = i;
        }
        i++;
    }
    console.log(`Found an answer : ${answer} to the question : ${question} at index ${answerIndex}`)

    // click the correct answer with li class sa-question-multichoice__item
    let queryRes = main.querySelector(`#sa-question-multichoice__item`)
    console.info(`clicking: ${queryRes}`);
    queryRes.click();

    let correctAnswer = main.querySelector(`#skill-assessment-quiz-${i} `);
    correctAnswer.click();
    // click the next button with id:"ember28"
    let nextButton = document.querySelector("#ember28");
    nextButton.click();
} else {
    console.log("incorrect")
}
    
//let questionLine = lines.findIndex((line) => line.startsWith(question));
