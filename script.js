class PomodoroTimer {
    constructor() {
        this.workTime = 25 * 60; // 25分を秒に変換
        this.breakTime = 5 * 60; // 5分を秒に変換
        this.currentTime = this.workTime;
        this.isRunning = false;
        this.isWorkSession = true;
        this.timer = null;
        this.totalTime = this.workTime;
        
        this.initElements();
        this.bindEvents();
        this.updateDisplay();
    }
    
    initElements() {
        this.timeDisplay = document.getElementById('time');
        this.sessionTypeDisplay = document.getElementById('sessionType');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.workTimeInput = document.getElementById('workTime');
        this.breakTimeInput = document.getElementById('breakTime');
        this.progressBar = document.getElementById('progressBar');
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.workTimeInput.addEventListener('change', () => this.updateSettings());
        this.breakTimeInput.addEventListener('change', () => this.updateSettings());
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startBtn.textContent = '実行中...';
            this.startBtn.disabled = true;
            this.timer = setInterval(() => this.tick(), 1000);
        }
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.startBtn.textContent = '開始';
            this.startBtn.disabled = false;
            clearInterval(this.timer);
        }
    }
    
    reset() {
        this.pause();
        this.currentTime = this.isWorkSession ? this.workTime : this.breakTime;
        this.totalTime = this.currentTime;
        this.updateDisplay();
        this.updateProgress();
    }
    
    tick() {
        this.currentTime--;
        this.updateDisplay();
        this.updateProgress();
        
        if (this.currentTime <= 0) {
            this.sessionComplete();
        }
    }
    
    sessionComplete() {
        this.pause();
        this.playNotification();
        
        // セッションを切り替え
        this.isWorkSession = !this.isWorkSession;
        this.currentTime = this.isWorkSession ? this.workTime : this.breakTime;
        this.totalTime = this.currentTime;
        
        this.updateDisplay();
        this.updateProgress();
        
        // 通知を表示
        const message = this.isWorkSession ? '休憩終了！作業を開始しましょう。' : '作業完了！休憩時間です。';
        alert(message);
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.sessionTypeDisplay.textContent = this.isWorkSession ? '作業セッション' : '休憩セッション';
        
        // セッションタイプに応じて色を変更
        if (this.isWorkSession) {
            this.timeDisplay.style.color = '#667eea';
        } else {
            this.timeDisplay.style.color = '#28a745';
        }
    }
    
    updateProgress() {
        const progress = ((this.totalTime - this.currentTime) / this.totalTime) * 100;
        this.progressBar.style.width = `${progress}%`;
    }
    
    updateSettings() {
        if (!this.isRunning) {
            this.workTime = parseInt(this.workTimeInput.value) * 60;
            this.breakTime = parseInt(this.breakTimeInput.value) * 60;
            
            // 現在のセッションタイプに応じて時間を更新
            this.currentTime = this.isWorkSession ? this.workTime : this.breakTime;
            this.totalTime = this.currentTime;
            this.updateDisplay();
            this.updateProgress();
        }
    }
    
    playNotification() {
        // Web Audio APIを使用して通知音を生成
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
}

// ページ読み込み完了後にタイマーを初期化
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});
