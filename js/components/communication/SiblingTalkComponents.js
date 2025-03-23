// Sibling Communication: Components that talk through a parent/container

export class SiblingContainer extends HTMLElement {
  constructor() {
    super();
    this._id = Math.floor(Math.random() * 10000);
  }
  
  connectedCallback() {
    console.log(`🏠 Sibling Container #${this._id}: Setting up the playground!`);
    
    // Create shadow DOM
    this.attachShadow({ mode: 'open' });
    
    // Initial render
    this.render();
    
    // Listen for and facilitate messages between siblings
    this.shadowRoot.addEventListener('message-sent', this.relayMessage.bind(this));
  }
  
  relayMessage(e) {
    const message = e.detail.message;
    const sender = e.detail.sender;
    
    // Find all receivers and relay the message
    const receivers = this.shadowRoot.querySelectorAll('sibling-receiver');
    receivers.forEach(receiver => {
      receiver.receiveMessage(message, sender);
    });
    
    console.log(`🏠 Sibling Container #${this._id}: Relayed message "${message}" from Sibling ${sender}`);
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          margin: 20px 0;
        }
        
        .container-card {
          background-color: var(--card-bg, #f8f9fa);
          border-radius: 10px;
          border: 2px solid #34a853;
          padding: 15px;
          font-family: 'Segoe UI', sans-serif;
          color: var(--text-color, #333);
        }
        
        .container-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          border-bottom: 1px solid var(--border-color, #eee);
          padding-bottom: 10px;
        }
        
        h2 {
          margin: 0;
          color: #34a853;
        }
        
        .siblings-layout {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        @media (min-width: 768px) {
          .siblings-layout {
            flex-direction: row;
          }
          
          .sibling-column {
            flex: 1;
          }
        }
        
        @media (max-width: 767px) {
          .siblings-layout {
            flex-direction: column;
          }
        }
        
        .sibling-column {
          min-width: 200px;
        }
        
        button {
          background-color: #34a853;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 12px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        button:hover {
          background-color: #2e7d32;
        }
        
        button:focus-visible {
          outline: 3px solid #a5d6a7;
          outline-offset: 2px;
        }
        
        @media (prefers-color-scheme: dark) {
          .container-card {
            border-color: #4caf50;
          }
          
          h2 {
            color: #4caf50;
          }
          
          button:focus-visible {
            outline-color: #81c784;
          }
        }

        /* Support for high contrast mode */
        :host-context(.high-contrast) .container-card {
          border: 3px solid white;
          background-color: #222;
          color: white;
        }

        :host-context(.high-contrast) h2 {
          color: white;
        }

        :host-context(.high-contrast) input {
          background-color: black;
          color: white;
          border: 2px solid white;
        }

        :host-context(.high-contrast) button {
          background-color: #0080ff;
          border: 2px solid white;
        }

        :host-context(.high-contrast) .messages-panel {
          background-color: #333;
        }

        :host-context(.high-contrast) .message {
          border: 1px solid #666;
        }
      </style>
      
      <div class="container-card" role="region" aria-labelledby="container-heading-${this._id}">
        <div class="container-header">
          <h2 id="container-heading-${this._id}">Sibling Container #${this._id}</h2>
          <button id="add-receiver" aria-label="Add new receiver component">Add Receiver</button>
        </div>
        
        <div class="siblings-layout">
          <div class="sibling-column senders" role="group" aria-label="Message senders">
            <sibling-sender id="sender-1" name="A"></sibling-sender>
            <sibling-sender id="sender-2" name="B"></sibling-sender>
          </div>
          
          <div class="sibling-column receivers" role="group" aria-label="Message receivers">
            <sibling-receiver id="receiver-1" name="X"></sibling-receiver>
            <sibling-receiver id="receiver-2" name="Y"></sibling-receiver>
          </div>
        </div>
      </div>
    `;
    
    // Add event listeners
    this.shadowRoot.querySelector('#add-receiver').addEventListener('click', () => {
      const receiverColumn = this.shadowRoot.querySelector('.receivers');
      const newReceiver = document.createElement('sibling-receiver');
      
      // Generate a unique name for the new receiver
      const existingReceivers = this.shadowRoot.querySelectorAll('sibling-receiver');
      const nextLetter = String.fromCharCode(88 + existingReceivers.length); // Start from 'X'
      
      newReceiver.setAttribute('name', nextLetter);
      newReceiver.id = `receiver-${existingReceivers.length + 1}`;
      
      receiverColumn.appendChild(newReceiver);
      
      console.log(`🏠 Sibling Container #${this._id}: Added new receiver "${nextLetter}"`);
    });
  }
  
  disconnectedCallback() {
    console.log(`🏠 Sibling Container #${this._id}: Playground closed. Cleaning up...`);
    
    // Clean up event listeners
    this.shadowRoot.removeEventListener('message-sent', this.relayMessage);
  }
}

export class SiblingSender extends HTMLElement {
  constructor() {
    super();
    this._id = Math.floor(Math.random() * 10000);
  }
  
  static get observedAttributes() {
    return ['name'];
  }
  
  connectedCallback() {
    const name = this.getAttribute('name') || '?';
    console.log(`🗣️ Sender ${name} #${this._id}: Ready to send messages!`);
    
    // Create shadow DOM
    this.attachShadow({ mode: 'open' });
    
    // Initial render
    this.render();
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'name' && this.shadowRoot) {
      this.render();
    }
  }
  
  render() {
    const name = this.getAttribute('name') || '?';
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 10px 0;
        }
        
        .sender-card {
          background-color: var(--card-bg, white);
          border-radius: 8px;
          border: 2px solid #ea4335;
          padding: 12px;
          color: var(--text-color, #333);
        }
        
        .sender-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color, #eee);
          padding-bottom: 8px;
          margin-bottom: 8px;
        }
        
        h3 {
          margin: 0;
          color: #ea4335;
        }
        
        .send-controls {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        input {
          padding: 8px;
          border: 1px solid var(--border-color, #ddd);
          border-radius: 4px;
          background-color: var(--card-bg, white);
          color: var(--text-color, #333);
        }
        
        button {
          background-color: #ea4335;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        button:hover {
          background-color: #c62828;
        }
        
        button:focus-visible {
          outline: 3px solid #ef9a9a;
          outline-offset: 2px;
        }
        
        @media (prefers-color-scheme: dark) {
          .sender-card {
            border-color: #f44336;
          }
          
          h3 {
            color: #f44336;
          }
          
          button:focus-visible {
            outline-color: #e57373;
          }
        }

        /* Support for high contrast mode */
        :host-context(.high-contrast) .sender-card {
          border: 3px solid white;
          background-color: #222;
          color: white;
        }

        :host-context(.high-contrast) h3 {
          color: white;
        }

        :host-context(.high-contrast) input {
          background-color: black;
          color: white;
          border: 2px solid white;
        }

        :host-context(.high-contrast) button {
          background-color: #0080ff;
          border: 2px solid white;
        }

        :host-context(.high-contrast) .messages-panel {
          background-color: #333;
        }

        :host-context(.high-contrast) .message {
          border: 1px solid #666;
        }
      </style>
      
      <div class="sender-card" role="region" aria-labelledby="sender-heading-${this._id}">
        <div class="sender-header">
          <h3 id="sender-heading-${this._id}">Sender ${name}</h3>
          <span aria-hidden="true">📣</span>
        </div>
        
        <div class="send-controls">
          <input type="text" class="message-input" 
            aria-label="Message to send to receivers" 
            placeholder="Type a message" 
            value="Hello from Sender ${name}!">
          <button class="send-button" aria-label="Send message to all receivers">Send to All Receivers</button>
        </div>
      </div>
    `;
    
    // Add event listeners
    this.shadowRoot.querySelector('.send-button').addEventListener('click', () => {
      const message = this.shadowRoot.querySelector('.message-input').value;
      const name = this.getAttribute('name') || '?';
      
      this.dispatchEvent(new CustomEvent('message-sent', {
        bubbles: true,
        composed: true,
        detail: { 
          message,
          sender: name
        }
      }));
      
      console.log(`🗣️ Sender ${name} #${this._id}: Sent message "${message}"`);
    });
  }
  
  disconnectedCallback() {
    const name = this.getAttribute('name') || '?';
    console.log(`🗣️ Sender ${name} #${this._id}: Signing off!`);
  }
}

export class SiblingReceiver extends HTMLElement {
  constructor() {
    super();
    this._id = Math.floor(Math.random() * 10000);
    this._messages = [];
  }
  
  static get observedAttributes() {
    return ['name'];
  }
  
  connectedCallback() {
    const name = this.getAttribute('name') || '?';
    console.log(`👂 Receiver ${name} #${this._id}: Listening for messages!`);
    
    // Create shadow DOM
    this.attachShadow({ mode: 'open' });
    
    // Initial render
    this.render();
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'name' && this.shadowRoot) {
      this.render();
    }
  }
  
  receiveMessage(message, sender) {
    const name = this.getAttribute('name') || '?';
    
    // Add message to history
    this._messages.unshift({ 
      text: message, 
      sender, 
      time: new Date().toLocaleTimeString() 
    });
    
    // Keep only the 5 most recent messages
    if (this._messages.length > 5) {
      this._messages.pop();
    }
    
    // Update the message display
    this.updateMessages();
    
    console.log(`👂 Receiver ${name} #${this._id}: Received message "${message}" from Sender ${sender}`);
  }
  
  updateMessages() {
    const messagesList = this.shadowRoot.querySelector('.messages-list');
    if (!messagesList) return;
    
    messagesList.innerHTML = this._messages.length 
      ? this._messages.map(msg => `
          <div class="message">
            <div class="message-header">
              <span class="sender">From ${msg.sender}</span>
              <span class="time">${msg.time}</span>
            </div>
            <div class="message-body">${msg.text}</div>
          </div>
        `).join('')
      : '<div class="no-messages">No messages yet</div>';
    
    // Animate the newest message
    const firstMessage = messagesList.querySelector('.message');
    if (firstMessage) {
      firstMessage.classList.add('new');
      setTimeout(() => {
        firstMessage.classList.remove('new');
      }, 1000);
    }
  }
  
  render() {
    const name = this.getAttribute('name') || '?';
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 10px 0;
        }
        
        .receiver-card {
          background-color: var(--card-bg, white);
          border-radius: 8px;
          border: 2px solid #9c27b0;
          padding: 12px;
          color: var(--text-color, #333);
        }
        
        .receiver-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color, #eee);
          padding-bottom: 8px;
          margin-bottom: 8px;
        }
        
        h3 {
          margin: 0;
          color: #9c27b0;
        }
        
        .messages-panel {
          background-color: var(--highlight-color, #f3e5f5);
          border-radius: 6px;
          padding: 8px;
          max-height: 200px;
          overflow-y: auto;
        }
        
        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .message {
          background-color: var(--card-bg, white);
          border-radius: 6px;
          padding: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .message.new {
          animation: highlight-message 1s ease-in-out;
        }
        
        @keyframes highlight-message {
          0% { background-color: rgba(225, 190, 231, 0.5); }
          100% { background-color: var(--card-bg, white); }
        }
        
        .message-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.8em;
          color: var(--text-color, #666);
          margin-bottom: 4px;
          opacity: 0.8;
        }
        
        .message-body {
          font-weight: bold;
        }
        
        .no-messages {
          color: var(--text-color, #999);
          opacity: 0.7;
          font-style: italic;
          text-align: center;
        }
        
        @media (prefers-color-scheme: dark) {
          .receiver-card {
            border-color: #ba68c8;
          }
          
          h3 {
            color: #ba68c8;
          }
        }

        /* Support for high contrast mode */
        :host-context(.high-contrast) .receiver-card {
          border: 3px solid white;
          background-color: #222;
          color: white;
        }

        :host-context(.high-contrast) h3 {
          color: white;
        }

        :host-context(.high-contrast) input {
          background-color: black;
          color: white;
          border: 2px solid white;
        }

        :host-context(.high-contrast) button {
          background-color: #0080ff;
          border: 2px solid white;
        }

        :host-context(.high-contrast) .messages-panel {
          background-color: #333;
        }

        :host-context(.high-contrast) .message {
          border: 1px solid #666;
        }
      </style>
      
      <div class="receiver-card" role="region" aria-labelledby="receiver-heading-${this._id}">
        <div class="receiver-header">
          <h3 id="receiver-heading-${this._id}">Receiver ${name}</h3>
          <span aria-hidden="true">👂</span>
        </div>
        
        <div class="messages-panel">
          <div class="messages-list" role="log" aria-live="polite">
            <div class="no-messages">No messages yet</div>
          </div>
        </div>
      </div>
    `;
    
    // Update with any existing messages
    this.updateMessages();
  }
  
  disconnectedCallback() {
    const name = this.getAttribute('name') || '?';
    console.log(`👂 Receiver ${name} #${this._id}: Stopping listening!`);
  }
}

// Register the components
customElements.define('sibling-container', SiblingContainer);
customElements.define('sibling-sender', SiblingSender);
customElements.define('sibling-receiver', SiblingReceiver);
