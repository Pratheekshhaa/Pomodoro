const timerSelect = document.getElementById('timer-select');
        const timerDisplay = document.getElementById('timer-display');
        const startBtn = document.getElementById('start-btn');
        const stopBtn = document.getElementById('stop-btn');
        const darkToggleBtn = document.getElementById('dark-toggle-btn');
        const progressRing = document.getElementById('progress-ring');
        const logList = document.getElementById('log-list');
        const body = document.body;

        let timerDuration = 25 * 60; // seconds
        let breakDuration = 10 * 60; // seconds
        let timer = null;
        let timeLeft = timerDuration;
        let isRunning = false;
        let isBreak = false;
        let startTime = null;

        // Update timer display from seconds
        function updateDisplay(seconds) {
            const m = Math.floor(seconds / 60).toString().padStart(2, '0');
            const s = (seconds % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `${m}:${s}`;
        }

        // Update progress ring (conic-gradient)
        function updateProgress() {
            let total = isBreak ? breakDuration : timerDuration;
            let elapsed = total - timeLeft;
            let percent = (elapsed / total) * 100;
            progressRing.style.background = `conic-gradient(#e85a71 ${percent}%, transparent ${percent}%)`;
        }

        // Set durations based on selection
        function setDurations() {
            const val = parseInt(timerSelect.value, 10);
            timerDuration = val * 60;
            if (val === 25) breakDuration = 10 * 60;
            else if (val === 45) breakDuration = 15 * 60;
            else if (val === 60) breakDuration = 20 * 60;

            timeLeft = isBreak ? breakDuration : timerDuration;
            updateDisplay(timeLeft);
            updateProgress();
        }

        timerSelect.addEventListener('change', () => {
            if (isRunning) return; // don't change while running
            setDurations();
        });

        function startTimer() {
            if (isRunning) return;
            isRunning = true;
            startBtn.disabled = true;
            stopBtn.disabled = false;
            startTime = Date.now();
            tick();
        }

        function stopTimer() {
            if (!isRunning) return;
            isRunning = false;
            startBtn.disabled = false;
            stopBtn.disabled = true;
            clearTimeout(timer);
        }

        function tick() {
            if (!isRunning) return;

            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            timeLeft = (isBreak ? breakDuration : timerDuration) - elapsed;

            if (timeLeft <= 0) {
                // Timer done, switch between work/break
                if (isBreak) {
                    logSession('Break ended');
                    isBreak = false;
                } else {
                    logSession('Work session ended, break started');
                    isBreak = true;
                }
                timeLeft = isBreak ? breakDuration : timerDuration;
                startTime = Date.now();
                updateDisplay(timeLeft);
                updateProgress();
                timer = setTimeout(tick, 1000);
                return;
            }

            updateDisplay(timeLeft);
            updateProgress();
            timer = setTimeout(tick, 1000);
        }

        function logSession(text) {
            const li = document.createElement('li');
            li.textContent = `${new Date().toLocaleTimeString()}: ${text}`;
            logList.prepend(li);
        }

        startBtn.addEventListener('click', () => {
            startTimer();
        });

        stopBtn.addEventListener('click', () => {
            stopTimer();
        });

        darkToggleBtn.addEventListener('click', () => {
            body.classList.toggle('dark');
        });

        // Initialize display on page load
        setDurations();