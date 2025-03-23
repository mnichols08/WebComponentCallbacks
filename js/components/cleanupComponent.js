// Define the CleanupComponent (Farewell Tour)
export class CleanupComponent extends HTMLElement {
  constructor() {
    super();
    this._id = Math.floor(Math.random() * 10000);
    this._countdown = 10; // 10 second countdown
    this._colors = ['#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688'];
    this._color = this._colors[Math.floor(Math.random() * this._colors.length)];
  }
  
  connectedCallback() {
    console.log(`🔄 Cleanup Component #${this._id}: Starting my farewell tour!`);
    
    // Create and attach Shadow DOM
    this.attachShadow({ mode: 'open' });
    
    // Create the component's HTML
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 280px;
          transition: all 0.3s ease;
        }
        
        .cleanup-card {
          background-color: ${this._color};
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          padding: 20px;
          color: white;
          text-align: center;
          position: relative;
        }
        
        h2 {
          margin-top: 0;
          font-size: 1.5em;
        }
        
        .timer {
          font-size: 2em;
          font-weight: bold;
          margin: 10px 0;
        }
        
        .progress-bar {
          height: 10px;
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 5px;
          margin: 15px 0;
          overflow: hidden;
        }
        
        .progress {
          height: 100%;
          background-color: white;
          width: 100%;
          transition: width 1s linear;
        }
        
        .button {
          background-color: rgba(255, 255, 255, 0.25);
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          margin-top: 10px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s;
        }
        
        .button:hover {
          background-color: rgba(255, 255, 255, 0.4);
        }
        
        .remove-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255, 255, 255, 0.3);
          border: none;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .farewell {
          animation: pulse 1s infinite;
        }
      </style>
      <div class="cleanup-card">
        <button class="remove-btn">×</button>
        <h2>Farewell Tour</h2>
        <p>Component ID: #${this._id}</p>
        <p>I'll self-destruct in:</p>
        <div class="timer">${this._countdown}</div>
        <div class="progress-bar">
          <div class="progress"></div>
        </div>
        <button class="button">Reset Timer</button>
      </div>
    `;
    
    // Start our periodic activity - this will be cleaned up in disconnectedCallback
    this._intervalId = setInterval(() => {
      console.log(`Cleanup Component #${this._id}: Still here... ${this._countdown} seconds remaining`);
    }, 1000);
    
    // Set up countdown
    this.startCountdown();
    
    // Add event listeners
    this.shadowRoot.querySelector('.button').addEventListener('click', () => this.resetTimer());
    this.shadowRoot.querySelector('.remove-btn').addEventListener('click', () => this.remove());
  }
  
  startCountdown() {
    // Reset the progress bar
    const progressBar = this.shadowRoot.querySelector('.progress');
    progressBar.style.width = '100%';
    
    // Start the countdown timer
    this._countdownTimer = setInterval(() => {
      this._countdown--;
      this.shadowRoot.querySelector('.timer').textContent = this._countdown;
      
      // Update progress bar
      const percentage = (this._countdown / 10) * 100;
      progressBar.style.width = `${percentage}%`;
      
      if (this._countdown <= 3) {
        this.shadowRoot.querySelector('.cleanup-card').classList.add('farewell');
      }
      
      if (this._countdown <= 0) {
        // Self-destruct when countdown reaches zero
        clearInterval(this._countdownTimer);
        console.log(`👋 Cleanup Component #${this._id}: Time's up! Initiating self-destruction...`);
        // Remove after a short delay to show 0
        setTimeout(() => {
          this.remove();
        }, 500);
      }
    }, 1000);
  }
  
  resetTimer() {
    console.log(`Cleanup Component #${this._id}: Timer reset to 10 seconds!`);
    
    // Clear existing timer
    clearInterval(this._countdownTimer);
    
    // Reset countdown and UI
    this._countdown = 10;
    this.shadowRoot.querySelector('.timer').textContent = this._countdown;
    this.shadowRoot.querySelector('.cleanup-card').classList.remove('farewell');
    
    // Start a new countdown
    this.startCountdown();
  }
  
  disconnectedCallback() {
    console.log(`💫 Cleanup Component #${this._id}: It's been a pleasure serving you! Cleaning up...`);
    
    // Clear our intervals to prevent memory leaks
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }
    
    if (this._countdownTimer) {
      clearInterval(this._countdownTimer);
    }
    
    // Remove any event listeners
    const resetButton = this.shadowRoot?.querySelector('.button');
    if (resetButton) {
      resetButton.removeEventListener('click', () => this.resetTimer());
    }
    
    const removeBtn = this.shadowRoot?.querySelector('.remove-btn');
    if (removeBtn) {
      removeBtn.removeEventListener('click', () => this.remove());
    }
  }
}

// Register the component
customElements.define('cleanup-demo', CleanupComponent);
