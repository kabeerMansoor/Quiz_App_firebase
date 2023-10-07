var box = document.getElementById("box");

window.startPage = function () {
    // Reset the content of the box element to the start page buttons
    box.innerHTML = `
        <h1 class="px-3 mt-3 text-white">Quiz App</h1>
        <button id="admin" class="redcolor text-white mt-5 px-3 py-2 rounded-3 w-50 " onclick="adminpanel()"  >Admin</button>
        <button id="students" class="greencolor mt-5 px-3 py-2 rounded-3 w-50 " onclick="studentpanel()"  >Students</button>
        <img src="images/quiz4.png" alt="quiz_pic" class="w-75 mt-5" />
    `;
}
startPage();

window.adminpanel = function () {
    box.innerHTML = `
        <div class="admin">
        <h1 class="px-3 py-2 text-white mt-5 pt-5">Please Enter Details:</h1>
            <form action="" class="mt-3">
                <label for="adminname">
                    <input type="text" placeholder="username" class="px-5 py-2 w-100 text-center" id="adminname" />
                </label><br/>
                <label for="adminpass">
                    <input type="password" placeholder="password" class="px-5 py-2 mt-5 w-100 text-center" id="adminpass" />
                </label>
                <div class="text-center">
                    <button type="button" onclick="security()" class="mt-5 px-3 py-2 greencolor rounded-3">Submit</button>
                    <button type="button" onclick="goToStartPage()" class="mt-5 px-3 py-2 redcolor text-white rounded-3">Back to Start</button>
                </div>
            </form>
        </div>
    `;

}
window.goToStartPage = function () {
    startPage(); // Call your start page function here.
}

window.signup = function () {

    box.innerHTML = `
        <h1 class=" py-2 text-white mt-5">Enter Data</h1>
        <input type="text" placeholder="Enter your question" id="question" class="quizdata"/>
        <input type="text" placeholder="Enter your option1" id="option1" class="quizdata"/>
        <input type="text" placeholder="Enter your option2" id="option2" class="quizdata"/>
        <input type="text" placeholder="Enter your option3" id="option3" class="quizdata"/>
        <input type="text" placeholder="Enter your option4" id="option4" class="quizdata"/>
        <input type="text" placeholder="Enter your answer" id="answer" class="quizdata"/>
        <div class="d-flex justify-content-between mt-4">
        <button onclick="sendadmindatatodatabase()" class="greencolor px-3 py-2 rounded-3 m-2">submit</button>
        <button onclick="goBack()" class="redcolor px-3 py-2 text-white rounded-3 m-2">back</button>
        </div>
    `;
}
window.security = function () {
    var name = document.getElementById("adminname");
    var password = document.getElementById("adminpass");

    if (name.value == "kabeer" && password.value == "hellopakistan") {
        signup();
    } else {
        alert("Please enter correct username or password:");
    }
}
window.goBack = function () {
    adminpanel(); // Call your starting page function here.
}


//Firebase :
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

import { getDatabase, ref, set, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";


var firebaseConfig = {
    apiKey: "AIzaSyBxQVQej7BnQvp5acnj9stFRAy2NVUTQPE",
    authDomain: "kabeer-mcqs-app.firebaseapp.com",
    projectId: "kabeer-mcqs-app",
    storageBucket: "kabeer-mcqs-app.appspot.com",
    messagingSenderId: "987814832271",
    appId: "1:987814832271:web:095255efb786cca6fee8fa",
    measurementId: "G-MS4HBH58QL"
};

// Initialize Firebase
var app = initializeApp(firebaseConfig);
var database = getDatabase(app);


window.sendadmindatatodatabase = function () {
    var questiondata = {
        question: question.value,
        option1: option1.value,
        option2: option2.value,
        option3: option3.value,
        option4: option4.value,
        answer: answer.value
    }

    var referkey = ref(database);
    var randomid = push(referkey).key;
    questiondata.id = randomid;
    var reference = ref(database, `questions/${questiondata.id}`);
    set(reference, questiondata);

    // Clear the input fields after processing the data
    question.value = "";
    option1.value = "";
    option2.value = "";
    option3.value = "";
    option4.value = "";
    answer.value = "";
}





var questionlist = [];
var studentname = ""
window.studentpanel = function () {
   studentname = prompt("Enter your name");
   if(studentname){
    box.innerHTML = getDataFromDatabase();
   }else{
    alert("Please enter name:")
   }
}

window.getDataFromDatabase = function () {
    var refer = ref(database, "questions");
    onChildAdded(refer, function (data) {
        render(data.val()); 
    });
};

var currentQuestionIndex = 0;
var score = 0;
var totalSeconds = 180; 
var timer;

window.render = function (data) {

    if (data) {
        questionlist.push(data);
    }
   
     function countdownTimer(callback) {
        timer = setInterval(function () {
            var minutes = Math.floor(totalSeconds / 60);
            var seconds = totalSeconds % 60;
            var timerDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
          
            var timerDisplayElement = document.getElementById('timerDisplay');
    
            if (timerDisplayElement) {
                timerDisplayElement.innerText = timerDisplay;
            }
    
            totalSeconds--;
    
            if (totalSeconds < 0) {
                clearInterval(timer);
                // Disable the next button
                var nextButton = document.getElementById('nextButton');
                if (nextButton) {
                    nextButton.disabled = true;
                }
    
                if (typeof callback === "function") {
                    callback(); 
                }
            }
        }, 1000);
    }

    if (!timer) {
        countdownTimer(function () {
         
            var userScore = score;
            var percentage = (score / questionlist.length) * 100;
            box.innerHTML = `<div class="scorebox">
            <p>Timesup! ${studentname}</p>
            <p>Your score is ${score}</p>
            <p>Your percentage is ${score/questionlist.length*100}%</p>
            <p><button onclick="senduserdatatodatabase()" class="scoreboxButtons ok" >OK</button></p>
            <p><button onclick="playAgain()" class="scoreboxButtons playagain" ><i class="fa-solid fa-rotate-right"></i> Playagain</button></p>
            </div>
            `;
        });
    }
    


  box.innerHTML = " "
  if (currentQuestionIndex < questionlist.length) {
        var currentQuestion = questionlist[currentQuestionIndex];
        box.innerHTML += `<div class="container">
        <div class="item">${studentname}</div>
        <div class="item">${currentQuestionIndex+1}/${questionlist.length}</div>
    </div>
    <div id="timerDisplay" class="item text-center mt-3"></div>
            <p class="color questionstudent px-3 py-2 w-75 fs-4">${currentQuestion.question}</p>
            <label for="option1" class="options w-75">
                <input type="radio" id="option1" class="color px-3 py-2 mx-3" name="hello"  />${currentQuestion.option1}
            </label>
            <label for="option2" class="options w-75">
                <input type="radio" id="option2" class="color px-3 py-2 mx-3" name="hello"  />${currentQuestion.option2}
            </label>
            <label for="option3" class="options w-75">
                <input type="radio" id="option3" class="color px-3 py-2 mx-3"  name="hello" />${currentQuestion.option3}
            </label>
            <label for="option4" class="options w-75">
                <input type="radio" id="option4" class="color px-3 py-2 mx-3"  name="hello" />${currentQuestion.option4}
            </label>
            <button onclick="nextquestion('${studentname}')" class="nextbutton w-25" >Next</button>
            
            <hr/>
            
        `;
       
        
    } else {
      
        box.innerHTML = `<div class="scorebox">
        <p>Hey! ${studentname}</p>
        <p>Your score is ${score}</p>
        <p>Your percentage is ${score/questionlist.length*100}%</p>
        <p><button onclick="senduserdatatodatabase()" class="scoreboxButtons ok" >OK</button></p>
        <p><button onclick="playAgain()" class="scoreboxButtons playagain" ><i class="fa-solid fa-rotate-right"></i> Playagain</button></p>
        </div>
        `;
    }
}



window.nextquestion = function(studentname) {

    var selectedRadioButtonId = document.querySelector('input[type=radio]:checked').id;
    var selectedOptionValue = questionlist[currentQuestionIndex][selectedRadioButtonId];
    var ans = questionlist[currentQuestionIndex].answer
        if (selectedOptionValue === ans) {
            score++;
            
        } 
        currentQuestionIndex++;
            render();
    } 



window.playAgain=function(){
    window.location.reload();
}


window.senduserdatatodatabase = function () {
    var userdata = {
        studentname: studentname,
        score: score,
        percentage: (score / questionlist.length) * 100
    };

    var referkey = ref(database);
    var randomid = push(referkey).key;
    userdata.id = randomid;
    var reference = ref(database, `Users/${userdata.id}`);
    set(reference, userdata);


    window.location.reload();
}


