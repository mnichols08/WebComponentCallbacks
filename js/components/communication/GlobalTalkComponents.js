// Global Communication: Using an EventBus for components that are far apart

import { EventBus } from '../../../js/EventBus.js';

export class GlobalSender extends HTMLElement {
  constructor() {
    super();
    this._id = Math.floor(Math.random() * 10000);
    this._messageCount = 0;
  }
  
  connectedCallback() {
    console.log(`🌎 Global Sender #${this._id}: Ready to broadcast globally!`);
    
    // Create shadow DOM
    this.attachShadow({ mode: 'open' });
    
    // Initial render
    this.render();
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 10px 0;
        }
        
        .sender-card {
          background-color: var(--card-bg, white);
          border-radius: 8px;
          border: 2px solid #673ab7;
          padding: 12px;
          color: var(--text-color, #333);
        }
        
        .sender-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color, #eee);
          padding-bottom: 8px;
          margin-bottom: 12px;
        }
        
        h3 {
          margin: 0;
          color: #673ab7;
        }
        
        .send-controls {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        label {
          font-size: 0.9em;
          color: var(--text-color, #555);
          opacity: 0.9;
        }
        
        input, select {
          padding: 8px;
          border: 1px solid var(--border-color, #ddd);
          border-radius: 4px;
          background-color: var(--card-bg, white);
          color: var(--text-color, #333);
        }
        
        .buttons {
          display: flex;
          gap: 8px;
          margin-top: 5px;
        }
        
        button {
          flex: 1;
          background-color: #673ab7;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        button:hover {
          background-color: #5e35b1;
        }
        
        button:focus-visible {
          outline: 3px solid #b39ddb;
          outline-offset: 2px;
        }
        
        .announcement {
          background-color: #ff5722;
        }
        
        .announcement:hover {
          background-color: #e64a19;
        }
        
        .message-count {
          background-color: var(--highlight-color, #ede7f6);
          padding: 5px 10px;
          border-radius: 4px;
          text-align: center;
          font-size: 0.9em;
          margin-top: 10px;
        }
        
        @media (prefers-color-scheme: dark) {
          .sender-card {
            border-color: #7e57c2;
          }
          
          h3 {
            color: #7e57c2;
          }
          
          button:focus-visible {
            outline-color: #9575cd;
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

        :host-context(.high-contrast) input,
        :host-context(.high-contrast) select {
          background-color: black;
          color: white;
          border: 2px solid white;
        }

        :host-context(.high-contrast) button {
          background-color: #0080ff;
          border: 2px solid white;
        }

        :host-context(.high-contrast) .announcement {
          background-color: #ff0000;
        }
      </style>
      
      <div class="sender-card" role="region" aria-labelledby="sender-heading-${this._id}">
        <div class="sender-header">
          <h3 id="sender-heading-${this._id}">Global Sender #${this._id}</h3>
          <span aria-hidden="true">🌎</span>
        </div>
        
        <div class="send-controls">
          <div class="input-group">
            <label for="message-type-${this._id}">Message Type:</label>
            <select id="message-type-${this._id}" aria-label="Select message type">
              <option value="global-message">Regular Message</option>
              <option value="global-announcement">Important Announcement</option>
              <option value="theme-change">Theme Change</option>
            </select>
          </div>
          
          <div class="input-group">
            <label for="message-input-${this._id}">Message:</label>
            <input type="text" id="message-input-${this._id}" value="Hello, world!" aria-label="Message content">
          </div>
          
          <div class="buttons">
            <button class="send-button" aria-label="Send message to listeners">Send Message</button>
            <button class="announcement" aria-label="Send urgent announcement to listeners">Broadcast Announcement</button>
          </div>
          
          <div class="message-count" aria-live="polite" aria-atomic="true">
            Messages sent: ${this._messageCount}
          </div>
        </div>
      </div>
    `;
    
    // Fix the references to the new unique IDs
    this._messageTypeElem = this.shadowRoot.querySelector(`#message-type-${this._id}`);
    this._messageInputElem = this.shadowRoot.querySelector(`#message-input-${this._id}`);
    
    // Add event listeners
    this.shadowRoot.querySelector('.send-button').addEventListener('click', () => {
      const messageType = this._messageTypeElem.value;
      const message = this._messageInputElem.value;
      
      EventBus.dispatchEvent(new CustomEvent(messageType, {
        detail: { 
          message,
          sender: this._id,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
      
      this._messageCount++;
      this.shadowRoot.querySelector('.message-count').textContent = `Messages sent: ${this._messageCount}`;
      
      console.log(`🌎 Global Sender #${this._id}: Dispatched "${messageType}" with message "${message}"`);
    });
    
    this.shadowRoot.querySelector('.announcement').addEventListener('click', () => {
      const message = this._messageInputElem.value || 'Important announcement!';
      
      EventBus.dispatchEvent(new CustomEvent('global-announcement', {
        detail: { 
          message,
          sender: this._id,
          timestamp: new Date().toLocaleTimeString(),
          urgent: true
        }
      }));
      
      this._messageCount++;
      this.shadowRoot.querySelector('.message-count').textContent = `Messages sent: ${this._messageCount}`;
      
      console.log(`🌎 Global Sender #${this._id}: Dispatched urgent announcement "${message}"`);
    });
  }
  
  disconnectedCallback() {
    console.log(`🌎 Global Sender #${this._id}: Signing off!`);
  }
}

export class GlobalListener extends HTMLElement {
  constructor() {
    super();
    this._id = Math.floor(Math.random() * 10000);
    this._messages = [];
    
    // Bind event handlers
    this._boundHandlers = {
      message: this.handleMessage.bind(this),
      announcement: this.handleAnnouncement.bind(this),
      theme: this.handleThemeChange.bind(this)
    };
  }
  
  connectedCallback() {
    console.log(`🌍 Global Listener #${this._id}: Listening to global events!`);
    
    // Create shadow DOM
    this.attachShadow({ mode: 'open' });
    
    // Initial render
    this.render();
    
    // Subscribe to global events
    EventBus.addEventListener('global-message', this._boundHandlers.message);
    EventBus.addEventListener('global-announcement', this._boundHandlers.announcement);
    EventBus.addEventListener('theme-change', this._boundHandlers.theme);
  }
  
  handleMessage(event) {
    const data = event.detail;
    
    // Add message to history
    this._messages.unshift({
      type: 'message',
      ...data
    });
    
    // Keep only the 10 most recent messages
    if (this._messages.length > 10) {
      this._messages.pop();
    }
    
    // Update the display
    this.updateMessages();
    
    console.log(`🌍 Global Listener #${this._id}: Received message "${data.message}" from Sender #${data.sender}`);
  }
  
  handleAnnouncement(event) {
    const data = event.detail;
    
    // Add announcement to history
    this._messages.unshift({
      type: 'announcement',
      ...data
    });
    
    // Keep only the 10 most recent messages
    if (this._messages.length > 10) {
      this._messages.pop();
    }
    
    // Update the display
    this.updateMessages();
    
    // Play an alert sound for urgent announcements
    if (data.urgent) {
      this.playAlert();
    }
    
    console.log(`🌍 Global Listener #${this._id}: Received ANNOUNCEMENT "${data.message}" from Sender #${data.sender}`);
  }
  
  handleThemeChange(event) {
    const data = event.detail;
    
    // Add theme change to history
    this._messages.unshift({
      type: 'theme',
      ...data
    });
    
    // Keep only the 10 most recent messages
    if (this._messages.length > 10) {
      this._messages.pop();
    }
    
    // Update the display
    this.updateMessages();
    
    // Change the card theme
    const card = this.shadowRoot.querySelector('.listener-card');
    if (card) {
      card.style.backgroundColor = data.message === 'dark' ? '#263238' : '#fff';
      
      // Also update text color for dark theme
      if (data.message === 'dark') {
        card.style.color = '#fff';
      } else {
        card.style.color = '';
      }
    }
    
    console.log(`🌍 Global Listener #${this._id}: Received theme change to "${data.message}" from Sender #${data.sender}`);
  }
  
  playAlert() {
    // Visual alert
    const card = this.shadowRoot.querySelector('.listener-card');
    if (card) {
      card.classList.add('urgent-alert');
      setTimeout(() => {
        card.classList.remove('urgent-alert');
      }, 2000);
    }
  }
  
  updateMessages() {
    const messagesList = this.shadowRoot.querySelector('.messages-list');
    if (!messagesList) return;
    
    messagesList.innerHTML = this._messages.length 
      ? this._messages.map(msg => `
          <div class="message ${msg.type} ${msg.urgent ? 'urgent' : ''}">
            <div class="message-header">
              <span class="type">${this.getTypeIcon(msg.type)} ${this.getTypeName(msg.type)}</span>
              <span class="time">${msg.timestamp}</span>
            </div>
            <div class="message-body">${msg.message}</div>
            <div class="message-footer">
              <span class="sender">From: Sender #${msg.sender}</span>
            </div>
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
  
  getTypeIcon(type) {
    switch(type) {
      case 'message': return '💬';
      case 'announcement': return '📢';
      case 'theme': return '🎨';
      default: return '📩';
    }
  }
  
  getTypeName(type) {
    switch(type) {
      case 'message': return 'Message';
      case 'announcement': return 'Announcement';
      case 'theme': return 'Theme Change';
      default: return 'Unknown';
    }
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 10px 0;
        }
        
        .listener-card {
          background-color: var(--card-bg, white);
          border-radius: 8px;
          border: 2px solid #2196f3;
          padding: 12px;
          transition: all 0.3s ease;
          color: var(--text-color, #333);
        }
        
        .listener-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color, #eee);
          padding-bottom: 8px;
          margin-bottom: 12px;
        }
        
        h3 {
          margin: 0;
          color: #2196f3;
        }
        
        .messages-panel {
          background-color: var(--highlight-color, #e3f2fd);
          border-radius: 6px;
          padding: 8px;
          max-height: 250px;
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
          padding: 10px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .message.announcement {
          border-left: 4px solid #ff5722;
        }
        
        .message.announcement.urgent {
          border-left: 4px solid #f44336;
          background-color: var(--card-bg, #ffebee);
        }
        
        .message.theme {
          border-left: 4px solid #9c27b0;
        }
        
        .message.new {
          animation: highlight-message 1s ease-in-out;
        }
        
        @keyframes highlight-message {
          0% { transform: translateX(-10px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        .message-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.85em;
          color: var(--text-color, #666);
          opacity: 0.8;
          margin-bottom: 6px;
        }
        
        .message-body {
          font-weight: bold;
          margin-bottom: 6px;
        }
        
        .message-footer {
          font-size: 0.8em;
          color: var(--text-color, #999);
          opacity: 0.8;
          text-align: right;
          font-style: italic;
        }
        
        .no-messages {
          color: var(--text-color, #999);
          opacity: 0.7;
          font-style: italic;
          text-align: center;
          padding: 20px;
        }
        
        .urgent-alert {
          animation: urgent-pulse 0.5s ease-in-out 4;
        }
        
        @keyframes urgent-pulse {
          0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(244, 67, 54, 0); }
          100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }
        }
        
        .controls {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
        }
        
        .subscribe-toggle {
          background-color: #2196f3;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 12px;
          cursor: pointer;
        }
        
        .subscribe-toggle:hover {
          background-color: #1976d2;
        }
        
        .subscribe-toggle:focus-visible {
          outline: 3px solid #90caf9;
          outline-offset: 2px;
        }
        
        .clear-messages {
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 12px;
          cursor: pointer;
        }
        
        .clear-messages:hover {
          background-color: #d32f2f;
        }
        
        .clear-messages:focus-visible {
          outline: 3px solid #ef9a9a;
          outline-offset: 2px;
        }
        
        @media (prefers-color-scheme: dark) {
          .listener-card {
            border-color: #42a5f5;
          }
          
          h3 {
            color: #42a5f5;
          }
          
          .message.announcement.urgent {
            background-color: rgba(244, 67, 54, 0.2);
          }
          
          .subscribe-toggle:focus-visible {
            outline-color: #64b5f6;
          }
          
          .clear-messages:focus-visible {
            outline-color: #e57373;
          }
        }

        /* Support for high contrast mode */
        :host-context(.high-contrast) .listener-card {
          border: 3px solid white;
          background-color: #222;
          color: white;
        }

        :host-context(.high-contrast) h3 {
          color: white;
        }

        :host-context(.high-contrast) .messages-panel {
          background-color: #333;
        }

        :host-context(.high-contrast) .message {
          border: 1px solid #666;
        }

        :host-context(.high-contrast) .message.urgent {
          border-left: 5px solid #ff0000;
        }
      </style>
      
      <div class="listener-card" role="region" aria-labelledby="listener-heading-${this._id}">
        <div class="listener-header">
          <h3 id="listener-heading-${this._id}">Global Listener #${this._id}</h3>
          <span aria-hidden="true">🌍</span>
        </div>
        
        <div class="messages-panel">
          <div class="messages-list" role="log" aria-live="polite">
            <div class="no-messages">No messages yet - waiting for global broadcasts...</div>
          </div>
        </div>
        
        <div class="controls">
          <button class="subscribe-toggle" aria-pressed="true">Unsubscribe</button>
          <button class="clear-messages" aria-label="Clear message history">Clear Messages</button>
        </div>
      </div>
    `;
    
    // Add event listeners
    this.shadowRoot.querySelector('.subscribe-toggle').addEventListener('click', (e) => {
      const button = e.target;
      const isSubscribed = button.textContent === 'Unsubscribe';
      
      if (isSubscribed) {
        // Unsubscribe from events
        EventBus.removeEventListener('global-message', this._boundHandlers.message);
        EventBus.removeEventListener('global-announcement', this._boundHandlers.announcement);
        EventBus.removeEventListener('theme-change', this._boundHandlers.theme);
        
        button.textContent = 'Subscribe';
        button.style.backgroundColor = '#4caf50';
        
        this.shadowRoot.querySelector('.messages-list').innerHTML = 
          '<div class="no-messages">Currently unsubscribed from global events</div>';
        
        console.log(`🌍 Global Listener #${this._id}: Unsubscribed from global events`);
      } else {
        // Resubscribe to events
        EventBus.addEventListener('global-message', this._boundHandlers.message);
        EventBus.addEventListener('global-announcement', this._boundHandlers.announcement);
        EventBus.addEventListener('theme-change', this._boundHandlers.theme);
        
        button.textContent = 'Unsubscribe';
        button.style.backgroundColor = '#2196f3';
        
        this.updateMessages();
        
        console.log(`🌍 Global Listener #${this._id}: Subscribed to global events`);
      }
    });
    
    this.shadowRoot.querySelector('.clear-messages').addEventListener('click', () => {
      this._messages = [];
      this.shadowRoot.querySelector('.messages-list').innerHTML = 
        '<div class="no-messages">No messages yet - waiting for global broadcasts...</div>';
      
      console.log(`🌍 Global Listener #${this._id}: Cleared message history`);
    });
  }
  
  disconnectedCallback() {
    console.log(`🌍 Global Listener #${this._id}: Disconnecting and cleaning up!`);
    
    // Unsubscribe from global events
    EventBus.removeEventListener('global-message', this._boundHandlers.message);
    EventBus.removeEventListener('global-announcement', this._boundHandlers.announcement);
    EventBus.removeEventListener('theme-change', this._boundHandlers.theme);
  }
}

// Register the components
customElements.define('global-sender', GlobalSender);
customElements.define('global-listener', GlobalListener);
