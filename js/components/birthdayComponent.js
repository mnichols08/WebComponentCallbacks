// Define the BirthdayComponent
export class BirthdayComponent extends HTMLElement {
  constructor() {
    super();
    this._id = Math.floor(Math.random() * 10000);
    this._colors = [
      '#FF5252', '#FF4081', '#E040FB', '#7C4DFF',
      '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
      '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41',
      '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'
    ];
    this._color = this._colors[Math.floor(Math.random() * this._colors.length)];
    this._confetti = ['🎉', '🎈', '🎊', '✨', '🎁', '🎂', '🍰'];
  }
  
  connectedCallback() {
    console.log(`🎂 Birthday Component #${this._id}: I'm alive! Time to party!`);
    
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
        
        .birthday-card {
          background-color: ${this._color};
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          padding: 20px;
          color: white;
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        
        .birthday-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }
        
        h2 {
          margin-top: 0;
          font-size: 1.5em;
        }
        
        .confetti {
          position: absolute;
          font-size: 1.5em;
          animation: fall 3s linear infinite;
          opacity: 0;
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
        
        @keyframes fall {
          0% {
            transform: translateY(-20px);
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(300px);
            opacity: 0;
          }
        }
      </style>
      <div class="birthday-card">
        <button class="remove-btn">×</button>
        <h2>Hello World!</h2>
        <p>I was born at ${new Date().toLocaleTimeString()}</p>
        <p>Component ID: #${this._id}</p>
        <button class="button">Celebrate!</button>
      </div>
    `;
    
    // Add event listeners
    this.shadowRoot.querySelector('.button').addEventListener('click', () => this.celebrate());
    this.shadowRoot.querySelector('.remove-btn').addEventListener('click', () => this.remove());
    
    // Start our periodic activity
    this._activityInterval = setInterval(() => {
      console.log(`Birthday Component #${this._id}: Still celebrating at ${new Date().toLocaleTimeString()}`);
    }, 5000);
  }
  
  celebrate() {
    console.log(`Birthday Component #${this._id}: Woohoo! Extra celebration!`);
    
    // Create confetti
    for (let i = 0; i < 15; i++) {
      this.addConfetti();
    }
    
    // Change background color
    const newColor = this._colors[Math.floor(Math.random() * this._colors.length)];
    this.shadowRoot.querySelector('.birthday-card').style.backgroundColor = newColor;
  }
  
  addConfetti() {
    const confetti = document.createElement('span');
    confetti.classList.add('confetti');
    confetti.textContent = this._confetti[Math.floor(Math.random() * this._confetti.length)];
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDuration = `${2 + Math.random() * 3}s`;
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    
    this.shadowRoot.querySelector('.birthday-card').appendChild(confetti);
    
    // Remove the confetti after animation completes
    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    }, 5000);
  }
  
  disconnectedCallback() {
    console.log(`💫 Birthday Component #${this._id}: It's been a pleasure serving you! Cleaning up...`);
    
    // Clear our interval to prevent memory leaks
    if (this._activityInterval) {
      clearInterval(this._activityInterval);
    }
    
    // Remove any event listeners if needed
    const button = this.shadowRoot?.querySelector('.button');
    if (button) {
      button.removeEventListener('click', this.celebrate);
    }
    
    const removeBtn = this.shadowRoot?.querySelector('.remove-btn');
    if (removeBtn) {
      removeBtn.removeEventListener('click', () => this.remove());
    }
  }
}

// Register the component
customElements.define('birthday-card', BirthdayComponent);
