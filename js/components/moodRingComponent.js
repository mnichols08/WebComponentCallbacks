// Define the MoodRing Component (Chameleon Effect)
export class MoodRing extends HTMLElement {
  constructor() {
    super();
    this._id = Math.floor(Math.random() * 10000);
    this._boundEventHandlers = {}; // Store bound event handlers for proper removal
  }
  
  // Define which attributes to observe
  static get observedAttributes() {
    return ['mood'];
  }
  
  connectedCallback() {
    console.log(`😊 Mood Ring Component #${this._id}: I'm ready to express my feelings!`);
    
    // Create and attach Shadow DOM
    this.attachShadow({ mode: 'open' });
    
    // Set initial mood if not set
    if (!this.hasAttribute('mood')) {
      this.setAttribute('mood', 'neutral');
    } else {
      // Force a render if mood was already set
      this.renderMood(this.getAttribute('mood'));
    }
  }
  
  // Called when observed attributes change - this is the "Chameleon Effect"
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'mood' && newValue) {
      console.log(`🔄 Mood Ring Component #${this._id}: Mood changing from ${oldValue || 'unset'} to ${newValue}!`);
      this.renderMood(newValue);
    }
  }
  
  renderMood(mood) {
    // Define mood properties
    const moodEmojis = {
      happy: '😀',
      sad: '😢',
      angry: '😠',
      confused: '🤔',
      neutral: '😐'
    };
    
    const moodColors = {
      happy: '#FFC107',
      sad: '#2196F3',
      angry: '#F44336',
      confused: '#9C27B0',
      neutral: '#607D8B'
    };
    
    const moodAnimations = {
      happy: 'bounce 0.5s infinite alternate',
      sad: 'droop 2s infinite',
      angry: 'shake 0.5s infinite',
      confused: 'spin 3s infinite',
      neutral: 'none'
    };
    
    const moodDescriptions = {
      happy: 'I feel great today! Everything is awesome!',
      sad: 'Feeling blue... could use a hug.',
      angry: 'Grrr! Something\'s really bothering me!',
      confused: 'Wait, what? I\'m not sure what\'s happening...',
      neutral: 'Just another day, nothing special.'
    };
    
    // Ensure we have a valid mood
    const currentMood = mood in moodEmojis ? mood : 'neutral';
    const emoji = moodEmojis[currentMood];
    const color = moodColors[currentMood];
    const animation = moodAnimations[currentMood];
    const description = moodDescriptions[currentMood];
    
    // Create the component's HTML
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 280px;
          transition: all 0.3s ease;
        }
        
        .mood-card {
          background-color: ${color};
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
        
        .emoji {
          font-size: 5em;
          margin: 15px 0;
          display: inline-block;
          animation: ${animation};
        }
        
        .mood-buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 5px;
          margin-top: 15px;
        }
        
        .mood-button {
          background-color: rgba(255, 255, 255, 0.25);
          border: none;
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s;
        }
        
        .mood-button:hover {
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
        
        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }
        
        @keyframes droop {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(-5deg); }
          100% { transform: rotate(0deg); }
        }
        
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(0); }
          75% { transform: translateX(5px); }
          100% { transform: translateX(0); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
      <div class="mood-card">
        <button class="remove-btn">×</button>
        <h2>Mood Ring #${this._id}</h2>
        <div class="emoji">${emoji}</div>
        <p>I'm feeling <strong>${currentMood}</strong>!</p>
        <p>${description}</p>
        <div class="mood-buttons">
          <button class="mood-button" data-mood="happy">Happy</button>
          <button class="mood-button" data-mood="sad">Sad</button>
          <button class="mood-button" data-mood="angry">Angry</button>
          <button class="mood-button" data-mood="confused">Confused</button>
          <button class="mood-button" data-mood="neutral">Neutral</button>
        </div>
      </div>
    `;
    
    // Clean up old event handlers if they exist
    this._removeEventListeners();
    
    // Create properly bound event handlers that we can remove later
    this._boundEventHandlers.remove = () => this.remove();
    this._boundEventHandlers.moodChange = (e) => {
      const newMood = e.target.dataset.mood;
      if (newMood) {
        this.setAttribute('mood', newMood);
      }
    };
    
    // Add event listeners
    const removeBtn = this.shadowRoot.querySelector('.remove-btn');
    if (removeBtn) {
      removeBtn.addEventListener('click', this._boundEventHandlers.remove);
    }
    
    // Add mood button listeners with properly bound handlers
    const moodButtons = this.shadowRoot.querySelectorAll('.mood-button');
    if (moodButtons) {
      moodButtons.forEach(button => {
        button.addEventListener('click', this._boundEventHandlers.moodChange);
      });
    }
  }
  
  _removeEventListeners() {
    // Remove the event listeners if element exists and handler is defined
    const removeBtn = this.shadowRoot?.querySelector('.remove-btn');
    if (removeBtn && this._boundEventHandlers.remove) {
      removeBtn.removeEventListener('click', this._boundEventHandlers.remove);
    }
    
    const moodButtons = this.shadowRoot?.querySelectorAll('.mood-button');
    if (moodButtons && this._boundEventHandlers.moodChange) {
      moodButtons.forEach(button => {
        button.removeEventListener('click', this._boundEventHandlers.moodChange);
      });
    }
  }
  
  disconnectedCallback() {
    console.log(`💫 Mood Ring Component #${this._id}: Goodbye! My final mood was ${this.getAttribute('mood')}.`);
    
    // Remove all event listeners
    this._removeEventListeners();
  }
}

// Register the component
customElements.define('mood-ring', MoodRing);
