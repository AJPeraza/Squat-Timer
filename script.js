const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const sound = document.getElementById("audio");
const pauseBtn = document.getElementById("pauseBtn");
const customTimeInput = document.getElementById("customTime");
const setTimeBtn = document.getElementById("setTimeBtn");

let isPaused = false;
let totalTime = 45 * 60; //45 minutes in seconds
let remainingTime = totalTime;
let timerInterval = null;
let endTime = null;

function updateTimer(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startTimer() {
    if (timerInterval || isPaused) return; // Prevent multiple intervals

    const now = Date.now();

    if (!endTime) {
        endTime = now + remainingTime * 1000;
    }

    timerInterval = setInterval(() => {
        const currentTime = Date.now();
        remainingTime = Math.max(Math.floor((endTime - currentTime) / 1000), 0);
        updateTimer(remainingTime);

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            endTime = null;
            loopSound(3);
            setTimeout(() => {
                showMessage("Time for 10 squats!");
            }, 100);
            
            //sound.onerror = () => alert("Could not load sound.");
            remainingTime = totalTime;
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

        remainingTime = Math.max(Math.floor((endTime - Date.now()) / 1000), 0);
        endTime = null;
    } else {
        //resume
        isPaused = false;
        pauseBtn.textContent = "Pause";
        startTimer();
    }
    
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = false;
    remainingTime = totalTime;
    endTime = null;
    pauseBtn.textContent = "Pause";
    updateTimer(remainingTime);

    startBtn.disabled = false;
    resetBtn.disabled = false;
}

function loopSound(times = 3, interval = 1000) {
    let count = 0;
    const soundLoop = setInterval(() => {
        try {
            sound.currentTime = 0;
            sound.play();
        } catch (e) {
            console.warn("Audio playback failed:", e);
        }
        count++;
        if (count >= times) {
            clearInterval(soundLoop)
        }
    }, interval)
}

function alertUser() {
    if ("vibrate" in navigator) {
        navigator.vibrate([500, 200, 500]);
    }
    showMessage("Time for 10 squats!");
    loopSound(3);
}

function showMessage(text) {
    const message = document.createElement('div');
    message.textContent = text;
    message.classList.add('message');
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 5000);
}

startBtn.addEventListener('click', () => {
    sound.play().then(() => {
        sound.pause();
        sound.currentTime = 0;
    }).catch((e) => {
        console.log("Preload failed, but will try later:", e);
    });

    startTimer();
})

setTimeBtn.addEventListener("click", () => {
    const inputMinutes = parseInt(customTimeInput.value);

    if (!isNaN(inputMinutes) && inputMinutes > 0 && inputMinutes <= 180) {
        totalTime = inputMinutes * 60;
        remainingTime = totalTime;
        endTime = null;
        updateTimer(remainingTime);
        showMessage(`Timer set to ${inputMinutes} minutes.`);
    } else {
        showMessage("Please enter a valid number between 1 and 180.");
    }
});

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
pauseBtn.addEventListener('click', pauseTimer);

timerDisplay.classList.add("alert");

setTimeout(() => {
    timerDisplay.classList.remove("alert");
}, 3000);

updateTimer(remainingTime); // Initialze on load