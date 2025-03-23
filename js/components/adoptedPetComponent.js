// Define the AdoptedPet Component (demonstrating adoptedCallback)
export class AdoptedPet extends HTMLElement {
  constructor() {
    super();
    this._id = Math.floor(Math.random() * 10000);
    this._petTypes = ['🐶', '🐱', '🐰', '🐦', '🐹', '🦊', '🐢', '🦜', '🐠'];
    this._petType = this._petTypes[Math.floor(Math.random() * this._petTypes.length)];
    this._petNames = ['Buddy', 'Luna', 'Charlie', 'Max', 'Bella', 'Daisy', 'Rocky', 'Lucy', 'Bailey'];
    this._petName = this._petNames[Math.floor(Math.random() * this._petNames.length)];
    this._homes = 0; // Track how many homes this pet has been in
    this._homeColors = ['#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
    this._isBeingAdopted = false; // Flag to prevent double increments
    this._hasShadowRoot = false; // Flag to track if shadow root has been attached
  }
  
  connectedCallback() {
    console.log(`🏡 Adoption Papers #${this._id}: ${this._petType} ${this._petName} has arrived at the shelter!`);
    
    // Create and attach Shadow DOM only if it hasn't been created already
    if (!this._hasShadowRoot) {
      this.attachShadow({ mode: 'open' });
      this._hasShadowRoot = true;
    }
    
    // Create our unique home ID that we'll display in the component
    if (!this._homeId) {
      this._homeId = document.createElement('div').id || Date.now().toString(36);
    }
    
    // Render initial state
    this.render();
  }
  
  adoptedCallback() {
    // Check if this is an actual adoption and not just a DOM reconnection
    if (!this._isBeingAdopted) {
      console.log(`🏠 ${this._petType} ${this._petName} (Pet #${this._id}): adoptedCallback triggered but not during adoption process. Ignoring.`);
      return;
    }
    
    this._homes++;
    console.log(`🏠 ${this._petType} ${this._petName} (Pet #${this._id}): New home! This is home #${this._homes}. Adjusting to my new document...`);
    
    // Update home ID for the new document
    this._homeId = document.createElement('div').id || Date.now().toString(36);
    
    // Render with updated home information
    this.render();
    
    // Show an adoption celebration animation
    this.celebrateAdoption();
    
    // Reset the adoption flag
    this._isBeingAdopted = false;
    
    // After adoption, make sure component is moved to forever homes container
    setTimeout(() => {
      const container = document.getElementById('forever-homes-container');
      if (container && this.parentElement && this.parentElement.id !== 'forever-homes-container') {
        container.appendChild(this);
      }
    }, 100);
  }
  
  celebrateAdoption() {
    const card = this.shadowRoot.querySelector('.adoption-card');
    if (card) {
      card.classList.add('adopted');
      
      // Remove the animation class after animation completes
      setTimeout(() => {
        if (card.classList.contains('adopted')) {
          card.classList.remove('adopted');
        }
      }, 2000);
    }
  }
  
  render() {
    // Only proceed if we have a shadowRoot
    if (!this.shadowRoot) return;
    
    // Get color based on number of homes (first color for first home, etc)
    const colorIndex = Math.min(this._homes, this._homeColors.length - 1);
    const cardColor = this._homeColors[colorIndex];
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 280px;
          transition: all 0.3s ease;
        }
        
        .adoption-card {
          background-color: ${cardColor};
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          padding: 20px;
          color: white;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .pet-icon {
          font-size: 5em;
          margin: 10px 0;
        }
        
        h2 {
          margin-top: 0;
          font-size: 1.5em;
        }
        
        .details {
          margin: 15px 0;
          font-size: 14px;
          text-align: left;
          background: rgba(255, 255, 255, 0.2);
          padding: 10px;
          border-radius: 5px;
        }
        
        .adoption-card.adopted {
          animation: celebrate 2s ease-in-out;
        }
        
        .buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
        }
        
        .button {
          background-color: rgba(255, 255, 255, 0.25);
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s;
          flex: 1;
          margin: 0 5px;
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
        
        @keyframes celebrate {
          0% { transform: scale(1); }
          10% { transform: scale(1.1); }
          20% { transform: scale(1); }
          30% { transform: scale(1.1); rotate(5deg); }
          40% { transform: scale(1); rotate(-5deg); }
          50% { transform: scale(1.05); rotate(0); }
          60% { transform: scale(1); }
          100% { transform: scale(1); }
        }
        
        .home-stamp {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(255, 255, 255, 0.3);
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 10px;
          font-weight: bold;
        }
      </style>
      <div class="adoption-card">
        <div class="home-stamp">Home #${this._homes} (${this._homeId})</div>
        <button class="remove-btn">×</button>
        <div class="pet-icon">${this._petType}</div>
        <h2>${this._petName}</h2>
        <div class="details">
          <p><strong>Pet ID:</strong> #${this._id}</p>
          <p><strong>Adoptions:</strong> ${this._homes} ${this._homes ? '(Previously adopted)' : '(Never adopted)'}</p>
          <p><strong>Current Home:</strong> ${this._homeId}</p>
        </div>
        <div class="buttons">
          <button class="button adopt-btn">Adopt Me!</button>
          <button class="button return-btn">Return to Shelter</button>
        </div>
      </div>
    `;
    
    // Add event listeners
    this.shadowRoot.querySelector('.remove-btn').addEventListener('click', () => this.remove());
    this.shadowRoot.querySelector('.adopt-btn').addEventListener('click', () => this.adoptPet());
    this.shadowRoot.querySelector('.return-btn').addEventListener('click', () => this.returnToShelter());
  }
  
  adoptPet() {
    console.log(`🏠 ${this._petType} ${this._petName} (Pet #${this._id}): Being adopted to a new home!`);
    
    // Set the flag to indicate this is an intentional adoption
    this._isBeingAdopted = true;
    
    // Create a new temporary document to trigger adoptedCallback
    const tempDoc = document.implementation.createHTMLDocument('Adoption Agency');
    
    // Move this element to the temporary document to trigger adoptedCallback
    tempDoc.body.appendChild(this);
    
    // Move it back to the forever homes container after a short delay
    setTimeout(() => {
      const container = document.getElementById('forever-homes-container');
      if (container) {
        container.appendChild(this);
      }
    }, 100);
  }
  
  returnToShelter() {
    console.log(`😢 ${this._petType} ${this._petName} (Pet #${this._id}): Returned to the shelter.`);
    
    // Show a sad animation or effect
    const card = this.shadowRoot.querySelector('.adoption-card');
    card.style.opacity = '0.6';
    
    // Reset after a moment
    setTimeout(() => {
      card.style.opacity = '1';
      
      // Move back to shelter
      const container = document.getElementById('adopted-container');
      if (container && this.parentElement && this.parentElement.id !== 'adopted-container') {
        container.appendChild(this);
      }
    }, 1000);
  }
  
  disconnectedCallback() {
    console.log(`💫 Adoption Papers #${this._id}: ${this._petType} ${this._petName} has left our system. Good luck!`);
    
    // Clean up any event listeners or timers if needed
  }
}

// Register the component
customElements.define('adopted-pet', AdoptedPet);
