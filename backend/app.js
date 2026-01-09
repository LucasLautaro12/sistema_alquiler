
// @ts-check
import { questions } from "./data/questions.js";
import { Quiz } from "./models/quiz.js";
import { UI } from "./models/UI.js";
/**
 * 
 * @param {Quiz} quiz 
 * @param {UI} ui 
 */
const renderPage = (quiz, ui) => {
    if (quiz.isEnded()) {
        ui.showScore(quiz.score)
    } else {
        ui.showQuestion(quiz.getQuestionIndex().text)
        ui.showChoices(quiz.getQuestionIndex().choices, (currentChoice) => {
            quiz.guess(currentChoice)
            renderPage(quiz, ui)
        })
        ui.showProgress(quiz.questionIndex+1, quiz.question.length)
    }

}

function main() {
    const quiz = new Quiz(questions)
    const ui = new UI();
    renderPage(quiz, ui)
}

main()