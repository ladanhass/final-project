document.addEventListener("DOMContentLoaded", function (){
const durationSelect = document.getElementById("duration-select");
const timerDisplay = document.getElementById("timer-display");
const playBtn= document.getElementById('play-btn');
const instructions = document.getElementById("instructions");
const pauseBtn = document.getElementById("pause-btn");
const stopBtn = document.getElementById("stop-btn");


let timerInterval;
let timeLeft;
let isRunning = false;
let isPaused = false;
let step = 0;
const steps = ["Inhale","Hold", "Exhale" , "Hold"];

function startTimer(duration){
    timeLeft = duration * 60;
    step = 0;
    updateTimerDisplay();
    updateInstructions();
    timerInterval = setInterval(function(){
        if(timeLeft > 0 ){
            timeLeft--;
            updateTimerDisplay();

            if(timeLeft % 4 === 0 ){
                step = (step + 1) % 4;
                updateInstructions();
            }
        }else{
            clearInterval(timerInterval);
            resetTimer();
        }
    }, 1000);
}
function updateTimerDisplay(){
    const minutes = Math.floor(timeLeft/60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

playBtn.addEventListener("click", function(){
    if(!isRunning && !isPaused && durationSelect.value){
        startTimer(parseInt(durationSelect.value));
        isRunning = true;
        isPaused = false;
    }else if (isPaused){
        isRunning = true;
        isPaused = false;
        resumeTimer();
    }
});
function resumeTimer(){
    timerInterval = setInterval(function(){
        if(timeLeft > 0 ){
            timeLeft--;
            updateTimerDisplay();

            if(timeLeft % 4 === 0 ){
                step = (step + 1) % 4;
                updateInstructions();
            }
        }else{
            clearInterval(timerInterval);
            resetTimer();
        }
    }, 1000);
}
pauseBtn.addEventListener("click", function(){
    if(isRunning){
        clearInterval(timerInterval);
        isRunning = false;
        isPaused = true;
    }
});
function updateInstructions(){
    instructions.textContent = steps[step];
}

function resetTimer(){
    isRunning = false;
    timeLeft = 0;
    step = 0;
    updateInstructions();
    timerDisplay.textContent = "00:00";
}
stopBtn.addEventListener("click", function(){
    resetTimer();
});

});
