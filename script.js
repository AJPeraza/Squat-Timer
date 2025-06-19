const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const sound = document.getElementById("audio");
const pauseBtn = document.getElementById("pauseBtn");
let isPaused = false;

let totalTime = 45 * 60; //45 minutes in seconds
let remainingTime = totalTime;
let timerInterval = null;

function updateTimer(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startTimer() {
    if (timerInterval || isPaused) return; // Prevent multiple intervals

    startBtn.disabled = true;
    resetBtn.disabled = false;

    timerInterval = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            loopSound(3);
            setTimeout(() => {
                showMessage("Time for 10 squats!");
            }, 100);
            
            //sound.onerror = () => alert("Could not load sound.");
            remainingTime = totalTime;
            updateTimer(remainingTime);
            isPaused = false;
        } else {
            remainingTime--;
            updateTimer(remainingTime);
        }
    }, 1000);
} 

function pauseTimer () {
    if (timerInterval) {
        //pause
        clearInterval(timerInterval);
        timerInterval = null;
        isPaused = true;
        pauseBtn.textContent = "Resume";
    } else {
        //resume
        isPaused = false;
        startTimer();
        pauseBtn.textContent = "Pause";
    }
    
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    remainingTime = totalTime;
    updateTimer(remainingTime);

    startBtn.disabled = false;
    resetBtn.disabled = false;
}

function loopSound(times = 3, interval = 1000) {
    let count = 0;
    const soundLoop = setInterval(() => {
        sound.currentTime = 0;
        sound.play();
        count++;
        if (count >= times) {
            clearInterval(soundLoop)
        }
    }, interval)
}

function showMessage(text) {
    const message = document.createElement('div');
    message.textContent = text;
    message.classList.add('message');
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 5000);
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
pauseBtn.addEventListener('click', pauseTimer);

timerDisplay.classList.add("alert");

setTimeout(() => {
    timerDisplay.classList.remove("alert");
}, 3000);

updateTimer(remainingTime); // Initialze on load