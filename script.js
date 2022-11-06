//Select Elemenets
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countDownElement  = document.querySelector(".countdown");



// Set options 
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
    let p = fetch("html_questions.json")
    p.then((response) => {
        return response.json();
    })
        .then((data) => {
            console.log(data.length)
            let questionsCount = data.length;

            // Create Bullets + Set Questions count 
            createBullets(questionsCount);

            //Add Question Data
            addQuestionData(data[currentIndex], questionsCount);

            //Click on Submit
            submitButton.onclick = () => {

                //Get Right Answer
                let theRightAnswer = data[currentIndex].right_answer;
                // console.log(theRightAnswer);

                //Increase Index
                currentIndex++;

                //Check the Answer
                checkAnswer(theRightAnswer, questionsCount)

                //Remove Previous Questions
                quizArea.innerHTML = "";
                answerArea.innerHTML = "";

                //Add Question Data
                addQuestionData(data[currentIndex], questionsCount);

                // Start countdown 
                clearInterval(countdownInterval);
                countdown(5, questionsCount);

                //Handle Bullets Class
                handleBullets();

                //Show Results
                showResults(questionsCount);
            }
        })
}
getQuestions()


function createBullets(num) {
    countSpan.innerHTML = num;

    //  Create Spans 
    for (let i = 0; i < num; i++) {

        // create span 
        let theBullet = document.createElement("span");

        // Check if its first span 
        if (i === 0) {
            theBullet.className = "on";
        }

        // Append bullets to main container 
        bulletsSpanContainer.appendChild(theBullet);
    }
}

//5
//0, 1, 2, 3, 4

function addQuestionData(obj, count) {
    if (currentIndex < count) {
        // console.log(obj)
        // console.log(count)

        // Create h2 Question Text
        let questionTitle = document.createElement("h2")

        //Create Question Text
        let questionText = document.createTextNode(obj['title']);

        //Append Text to h2
        questionTitle.appendChild(questionText)

        //Append this h2 to the Quiz Area
        quizArea.appendChild(questionTitle)

        //Create the answers
        for (let i = 1; i <= 4; i++) {

            //Create Main Answer Div
            let mainDiv = document.createElement("div");

            //Add Class to Main Div
            mainDiv.className = 'answer';

            // Create Radio Input
            let radioInput = document.createElement("input");

            //Add Type + Name + ID + Data attribute
            radioInput.name = 'questions';
            radioInput.type = 'radio';
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];

            //Make first option Selected
            if (i === 1) {
                radioInput.checked = true;
            }

            //Create Label
            let theLabel = document.createElement("label");
            //Add for attribute
            theLabel.htmlFor = `answer_${i}`;

            //Create Label Text
            let theLabelText = document.createTextNode(obj[`answer_${i}`])

            //Add the Text to Label
            theLabel.appendChild(theLabelText);

            //Add Input + Label to Main Div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);

            //Append All DIvs to Answers-Area
            answerArea.appendChild(mainDiv)
        }

    }
}

function checkAnswer(rAnswer, count) {
    // console.log(rAnswer)
    // console.log(count)

    let answers = document.getElementsByName("questions");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {

        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;

        }
    }

    // console.log(`Right Answer is: ${rAnswer}`);
    // console.log(`Choosen Answer is: ${theChoosenAnswer}`);

    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
        console.log("Good Answer")

    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    })
}

function showResults(count) {
//let the Results
    if (currentIndex === count) {
        //   console.log("Questions Is Finished")
        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        bullets.remove()

        if (rightAnswers > count / 2 && rightAnswers < count) {
            theResults = `<span class = "good"> Good </span>, ${rightAnswers} from ${count}`;
            console.log(theResults)
        } else if (rightAnswers === count) {
            theResults = `<span class = "perfect"> Perfect </span>, All answers are Correct`;

        } else{
            theResults = `<span class = "bad"> Bad </span>,  ${rightAnswers} from ${count}`;
        }
        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "10px" ;
        resultsContainer.style.backgroundColor = "white";
        resultsContainer.style.marginTop = "10px";
    }
}


function countdown(duration, count){
    if (currentIndex < count){
        let minutes, seconds;
        countdownInterval = setInterval(() => {
            minutes = parseInt(duration/60);
            seconds = parseInt(duration % 60);
 
           minutes = minutes < 10 ? `0${minutes}` : minutes;
           seconds = seconds < 10 ? `0${seconds}` : seconds;

          countDownElement.innerHTML = `${minutes}:${seconds}`
          if( --duration <0){
            clearInterval(countdownInterval);
            submitButton.click()
          }
        }, 1000);
    }
}