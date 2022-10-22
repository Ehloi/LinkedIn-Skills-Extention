import { Q_A_Array } from "./answers.js"
import * as levenshtein from 'fast-levenshtein';

// set border to red of the document
document.body.style.border = "5px solid red";

console.log("Starting script");

let main = document.querySelector("main");
let questionInnerText = main.querySelector("#assessment-a11y-title").innerText;
process(main,questionInnerText);
async function process(main, questionInnerText){

    let question = questionInnerText.split('\n')[0];
    console.log(question);
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
        console.log(`Answer from file ${answer}`)
        // find the most probable answer
        let minDistancePossibilities = 1000;
        let answerIndex = 0;
        let answerOnPage = '';
        let i = 0;
        for (const possibilitie of possibilities)
        {
            let distance = levenshtein.get(answer, possibilitie);
            if (distance < minDistancePossibilities){
                minDistancePossibilities = distance;
                answerOnPage = possibilitie;
                answerIndex = i;
            }
            console.log(`Possibility: ${possibilitie} Distance: ${distance}`)
            i++;
        }
        console.log(`Found the answer : ${answerOnPage} at index ${answerIndex}`)

        // Select the list with class name list-style-none
        let list = document.querySelector(".list-style-none");

        // regex that matches id=\"urn:li:assessementQuestion:*\"
        let regex = /urn:li:assessmentQuestion:[0-9]*-[0-9]/g;
        let matches = list.innerHTML.match(regex);
        
        // remove all the element in odd idex in matches
        for (let i = 0; i < matches.length; i++){
            if (i % 2 == 1){
                matches.splice(i, 1);
            }
        }

        // get the id of the answer
        let answerId = matches[answerIndex];

        console.log(answerId)

        // Click on the element with answerId
        document.getElementById(`${answerId}`).click();
    } else {
        console.log("incorrect")
    }
}

// wait for the question to change
document.addEventListener('DOMSubtreeModified', function () {
    if (questionInnerText != main.querySelector("#assessment-a11y-title").innerText){
        console.log("Page changed, starting process");
        main = document.querySelector("main");
        questionInnerText = main.querySelector("#assessment-a11y-title").innerText;
        process(main, questionInnerText);
    }
});