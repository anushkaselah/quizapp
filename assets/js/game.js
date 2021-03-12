/* followed a tutorial by Brian Design on youtube "How to Make a Quiz App using HTML CSS Javascript - Vanilla Javascript Project for Beginners Tutorial" as reference when writing this code */
// Set variables for elements from HTML page
const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const scoreText = document.getElementById("score");
const timeCount = document.getElementById("time");
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const progressText = document.getElementById("progressText");
const progressBarFull = document.getElementById("progressBarFull");

// Variables
let currentQuestion = {};
let acceptingAnswers = false; // create delay before next question
let score = 0; // calculate user score
let questionCounter = 0; // what question you are currently on
let availableQuestions = []; // copy of full question set
let timeValue = 30; // set time value to 30 sec
let questions = []; // questions put into array, moved to questions.json
let startGame;
let getNewQuestion;
let incrementScore;

fetch("https://opentdb.com/api.php?amount=20&category=9&difficulty=easy&type=multiple")
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question
            };
        
            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });

        //start game function
        startGame();

        })
    .catch((err) => {
        console.error(err);
    });

//Constants
const CORRECT_BONUS = 100; // points per question correct
const MAX_QUESTIONS = 4;   // max questions per game

//Starting the game
    startGame = () => {
    questionCounter = 0; //question start at 0
    score = 0; //score starts at 0
    availableQuestions = [...questions]; //spread operator to take array
    localStorage.setItem('mostRecentScore', score);
    getNewQuestion(); //next question to load

    // loader only shown when necessary
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

//start timer function to 30 secs
startTimer(30);



getNewQuestion = () => { //next question to load 
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("mostRecentScore", score);
        //if max questions go to the end page
        return window.location.assign("end.html");
    }

    questionCounter++; //when game is started,incrament to 1
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;

    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    //integer based on length of array
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];//refernce to current question
    question.innerText = currentQuestion.question;//question and choices populated


choices.forEach((choice) => {
        const number = choice.dataset.number;//access to custom atributes
        choice.innerText = currentQuestion['choice' + number];//inner html for correct answer
    });

availableQuestions.splice(questionIndex, 1); //splice out last question
    acceptingAnswers = true; //allow next question
};
//function to allow different choices
choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return; //if not ready to answer,ignore

        acceptingAnswers = false; //not to click before ready
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset.number;

        //detect if answer is correct or incorrect
        const classToApply =
        selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        if (classToApply === "correct") {
        incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
        selectedChoice.parentElement.classList.remove(classToApply);
        getNewQuestion(); // next question to load after answered
        }, 1000);
    });
});

//Timer
function startTimer(){
    setInterval(function() { 
        if(timeValue <= 0 ) {
            clearInterval(timeValue = 0); 
            return window.location.assign("end.html"); 
        }
        if(timeValue < 6 && timeValue > 0 || timeValue === 0){
                timeCount.style.color = "red";
            }
        
        timeCount.innerHTML = timeValue;
        timeValue  -=1;
    }, 1000) ; 
}



    // Score 
    incrementScore = num => {
  score += num;
  scoreText.innerText = score;
  if(score==100)
  scoreText.innerText = 'Poor';
  if(score==200)
  scoreText.innerText = 'Bad';
  if(score==300)
  scoreText.innerText = 'Good';
  if(score==400)
  scoreText.innerText = 'Strong';
  if(score==500)
  scoreText.innerText = 'Very Strong';
};