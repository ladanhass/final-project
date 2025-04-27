//Waits till DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
//Elements selectors
  const durationSelect = document.getElementById("duration-select");
  const timerDisplay = document.getElementById("timer-display");
  const playBtn = document.getElementById("play-btn");
  const instructions = document.getElementById("instructions");
  const pauseBtn = document.getElementById("pause-btn");
  const stopBtn = document.getElementById("stop-btn");
  const timeCircle = document.querySelector(".time-circle");
  const audioPlayer = document.getElementById("audio-player");
  const audioBtn = document.getElementById("audio-btn");
  const audioIcon = document.getElementById("audio-icon");
  const errorMsg = document.getElementById("error-msg");
  // state variables 
  let timerInterval;
  let timeLeft;
  let isRunning = false;
  let isPaused = false;
  let step = 0;
  const steps = ["Inhale", "Hold", "Exhale", "Hold"];
  //Stars timer
  function startTimer(duration) { 
    timeLeft = duration * 60;//Converts minutes to seconds
    step = 0; 
    updateTimerDisplay();
    updateInstructions();
    timeCircle.classList.add("animate");
    //Set interval to undate every second
    timerInterval = setInterval(function () {
      if (timeLeft > 0) {
        timeLeft--; // Time goes down by 1 second
        updateTimerDisplay();
       // Changes breathing step every 4 seconds
        if (timeLeft % 4 === 0) {
          step = (step + 1) % 4; //Goes through each step
          updateInstructions();
        }
      } else {
        //Clears and resets timer when times is up
        clearInterval(timerInterval);
        resetTimer();
      }
    }, 1000); //Updates timer every second
  }
  //updates timer and displays
  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60); //coverts time left into minutes
    const seconds = timeLeft % 60; //Remainder seconds are calculated
    //formats and diplays timer
    timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }
//starts timer
  playBtn.addEventListener("click", function () {
    if (!durationSelect.value) {
      //Shows error if no duration is selected
      errorMsg.textContent = "Please select duration";
      errorMsg.style.display = "block";
    } else {
      errorMsg.style.display = "none"; // hides error message
      //starts timmer
      if (!isRunning && !isPaused) {
        startTimer(parseInt(durationSelect.value)); //Stats timer with selected duration
        isRunning = true;
        isPaused = false;
      } else if (isPaused) {
        //Resumes timer if paused
        isRunning = true;
        isPaused = false;
        timeCircle.classList.add("animate");//starts animation
        resumeTimer(); 
      }
    }
  });
  //Resumes timer from where paused
  function resumeTimer() {
    timerInterval = setInterval(function () {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft % 4 === 0) {
          step = (step + 1) % 4;
          updateInstructions();
        }
      } else {
        clearInterval(timerInterval);
        resetTimer();
      }
    }, 1000); 
  }
  //Pauses timer when puase button is clicked 
  pauseBtn.addEventListener("click", function () {
    if (isRunning) {
      // pauses timer if it running
      clearInterval(timerInterval);//Stops time
      isRunning = false;
      isPaused = true;
      timeCircle.classList.remove("animate"); //stop animation
    }
  });
  //Updates breathing instructions 
  function updateInstructions() {
    instructions.textContent = steps[step];
  }
//Reset timer
  function resetTimer() {
    isRunning = false;
    timeLeft = 0; //Resets time 
    step = 0; // resets step
    updateInstructions();
    timerDisplay.textContent = "00:00";//Resets timer display
    instructions.textContent = "Begin Exercise"; // Resets instruction 
    timeCircle.classList.remove("animate");//Stops animation
  }
  //Stop button resets everthing
  stopBtn.addEventListener("click", function () {
    resetTimer();
  });
// Calming audio play/pause
  audioBtn.addEventListener("click", function () {
    if (audioPlayer.paused) {
      audioPlayer.play();//Play audio if paused
       //Change icon to audio playing
      audioIcon.classList.remove("bi-volume-mute-fill");
      audioIcon.classList.add("bi-volume-up-fill");
    } else {
      //Changes icon to audio paused 
      audioPlayer.pause();
      audioIcon.classList.remove("bi-volume-up-fill");
      audioIcon.classList.add("bi-volume-mute-fill");
    }
  });
});
