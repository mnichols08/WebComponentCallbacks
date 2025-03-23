// Parent-Child Communication: The Family Talk demo
import { getContrastTextColor } from '../../../js/colorUtils.js';

export class ParentComponent extends HTMLElement {
  constructor() {
    super();
    this._id = Math.floor(Math.random() * 10000);
    this._responseCount = 0;
  }
  
  connectedCallback() {
    console.log(`👨‍👩‍👧‍👦 Parent Component #${this._id}: Setting up the family!`);
    
    // Create shadow DOM
    this.attachShadow({ mode: 'open' });
    
    // Initial render
    this.render();
    
    // Listen for child responses
    this.shadowRoot.addEventListener('child-response', this.handleChildResponse.bind(this));
  }
  
  handleChildResponse(e) {
    this._responseCount++;
    
    // Update the response display
    const responseEl = this.shadowRoot.querySelector('.child-responses');
    if (responseEl) {
      responseEl.textContent = `Child says: ${e.detail.response}`;
      
      // Add "times" indicator if multiple responses
      if (this._responseCount > 1) {
        responseEl.textContent += ` (${this._responseCount} times)`;
      }
      
      // Highlight the new response
      responseEl.classList.add('highlight');
      setTimeout(() => {
        responseEl.classList.remove('highlight');
      }, 1000);
    }
    
    console.log(`👨‍👩‍👧‍👦 Parent Component #${this._id}: Received response from child: "${e.detail.response}"`);
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          margin: 20px 0;
        }
        
        .parent-card {
          background-color: var(--card-bg, #f8f9fa);
          border-radius: 10px;
          border: 2px solid #4285f4;
          padding: 15px;
          font-family: 'Segoe UI', sans-serif;
          color: var(--text-color, #333);
        }
        
        .parent-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          border-bottom: 1px solid var(--border-color, #eee);
          padding-bottom: 10px;
        }
        
        h2 {
          margin: 0;
          color: #4285f4;
        }
        
        .children-container {
          padding: 10px;
          background-color: var(--highlight-color, #f0f4f8);
          border-radius: 8px;
        }
        
        .response-panel {
          margin-top: 15px;
          padding: 10px;
          background-color: var(--highlight-color, #e8eaf6);
          border-radius: 8px;
        }
        
        .child-responses {
          padding: 8px;
          color: #5c6bc0;
          font-weight: bold;
        }
        
        .highlight {
          animation: highlight 1s ease-in-out;
        }
        
        @keyframes highlight {
          0% { 
            background-color: rgba(197, 202, 233, 0.5); 
            color: ${getContrastTextColor('rgba(197, 202, 233, 0.5)')}; 
          }
          100% { 
            background-color: transparent; 
          }
        }
        
        button {
          background-color: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 12px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        button:hover {
          background-color: #3367d6;
        }
        
        button:focus-visible {
          outline: 3px solid #a1c4fd;
          outline-offset: 2px;
        }
        
        .message-input {
          display: flex;
          gap: 10px;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        
        input {
          flex: 1;
          padding: 8px;
          border: 1px solid var(--border-color, #ccc);
          border-radius: 4px;
          background-color: var(--card-bg, #fff);
          color: var(--text-color, #333);
        }
        
        @media (prefers-color-scheme: dark) {
          .parent-card {
            border-color: #5c9eff;
          }
          
          h2, h3 {
            color: #5c9eff;
          }
          
          .child-responses {
            color: #7986cb;
          }
          
          button:focus-visible {
            outline-color: #83b9ff;
          }
        }
        
        /* Support for high contrast mode */
        :host-context(.high-contrast) .parent-card {
          border: 3px solid white;
          background-color: #222;
          color: white;
        }
        
        :host-context(.high-contrast) h2,
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
        
        :host-context(.high-contrast) button:hover {
          background-color: #00a0ff;
        }
        
        :host-context(.high-contrast) .children-container,
        :host-context(.high-contrast) .response-panel {
          background-color: #333;
        }
        
        /* Add contrast text utilities */
        .auto-contrast-text {
          transition: color 0.3s ease;
        }
      </style>
      
      <div class="parent-card contrast-monitor" role="region" aria-label="Parent component demonstration">
        <div class="parent-header">
          <h2 id="parent-heading-${this._id}" class="auto-contrast-text">Parent Component #${this._id}</h2>
          <span aria-hidden="true">👨‍👩‍👧‍👦</span>
        </div>
        
        <div class="message-input">
          <input type="text" id="message-input" 
            aria-label="Message to send to child" 
            value="Do your homework!">
          <button id="send-message" aria-label="Send message to child component">Send to Child</button>
        </div>
        
        <div class="children-container" aria-labelledby="parent-heading-${this._id}">
          <child-component message="Be good!"></child-component>
        </div>
        
        <div class="response-panel" aria-live="polite">
          <h3 class="auto-contrast-text">Child Responses:</h3>
          <div class="child-responses">Waiting for response...</div>
        </div>
      </div>
    `;
    
    // Apply contrast to the component after rendering
    this._applyInitialContrast();
    
    // Add event listeners
    this.shadowRoot.querySelector('#send-message').addEventListener('click', () => {
      const message = this.shadowRoot.querySelector('#message-input').value;
      const child = this.shadowRoot.querySelector('child-component');
      child.setAttribute('message', message);
      
      console.log(`👨‍👩‍👧‍👦 Parent Component #${this._id}: Sent message to child: "${message}"`);
    });
  }
  
  _applyInitialContrast() {
    // Wait for styles to be computed
    setTimeout(() => {
      const card = this.shadowRoot.querySelector('.parent-card');
      const computedStyle = getComputedStyle(card);
      const bgColor = computedStyle.backgroundColor;
      
      // Determine text color based on background
      const textColor = getContrastTextColor(bgColor);
      
      // Apply to auto-contrast elements
      const textElements = card.querySelectorAll('.auto-contrast-text');
      textElements.forEach(el => {
        el.style.color = textColor;
      });
    }, 0);
  }
  
  disconnectedCallback() {
    console.log(`👨‍👩‍👧‍👦 Parent Component #${this._id}: Family disbanded. Cleaning up...`);
    
    // Clean up event listeners
    this.shadowRoot.removeEventListener('child-response', this.handleChildResponse);
  }
}

export class ChildComponent extends HTMLElement {
  constructor() {
    super();
    this._id = Math.floor(Math.random() * 10000);
  }
  
  static get observedAttributes() {
    return ['message'];
  }
  
  connectedCallback() {
    console.log(`👶 Child Component #${this._id}: I'm here!`);
    
    // Create shadow DOM
    this.attachShadow({ mode: 'open' });
    
    // Initial render
    this.render();
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'message' && this.shadowRoot) {
      const messageEl = this.shadowRoot.querySelector('.parent-message');
      if (messageEl) {
        messageEl.textContent = newValue;
        
        // Add a brief highlight animation
        messageEl.classList.add('new-message');
        setTimeout(() => {
          messageEl.classList.remove('new-message');
        }, 1000);
      }
      
      console.log(`👶 Child Component #${this._id}: Received message from parent: "${newValue}"`);
    }
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 10px 0;
        }
        
        .child-card {
          background-color: var(--card-bg, white);
          border-radius: 8px;
          border: 2px solid #fbbc04;
          padding: 12px;
          color: var(--text-color, #333);
        }
        
        .child-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color, #eee);
          padding-bottom: 8px;
          margin-bottom: 8px;
        }
        
        h3 {
          margin: 0;
          color: #fbbc04;
        }
        
        .message-container {
          padding: 8px;
          background-color: var(--highlight-color, #fff8e1);
          border-radius: 6px;
          margin-bottom: 10px;
        }
        
        .parent-message {
          font-weight: bold;
          color: #fb8c00;
        }
        
        .new-message {
          animation: highlight-message 1s ease-in-out;
        }
        
        @keyframes highlight-message {
          0% { background-color: rgba(255, 224, 178, 0.5); }
          100% { background-color: transparent; }
        }
        
        .responses {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        button {
          background-color: #fbbc04;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 6px 10px;
          cursor: pointer;
          transition: background-color 0.3s;
          font-size: 0.9em;
        }
        
        button:hover {
          background-color: #f9a825;
        }
        
        button:focus-visible {
          outline: 3px solid #ffe082;
          outline-offset: 2px;
        }
        
        @media (prefers-color-scheme: dark) {
          .child-card {
            border-color: #ffd54f;
          }
          
          h3 {
            color: #ffd54f;
          }
          
          .parent-message {
            color: #ffb74d;
          }
          
          button:focus-visible {
            outline-color: #ffecb3;
          }
        }
        
        /* Support for high contrast mode */
        :host-context(.high-contrast) .child-card {
          border: 3px solid white;
          background-color: #222;
          color: white;
        }
        
        :host-context(.high-contrast) h3 {
          color: white;
        }
        
        :host-context(.high-contrast) .parent-message {
          color: white;
        }
        
        :host-context(.high-contrast) button {
          background-color: #0080ff;
          border: 2px solid white;
        }
        
        :host-context(.high-contrast) button:hover {
          background-color: #00a0ff;
        }
        
        :host-context(.high-contrast) .message-container {
          background-color: #333;
        }
      </style>
      
      <div class="child-card" role="region" aria-label="Child component demonstration">
        <div class="child-header">
          <h3 id="child-heading-${this._id}">Child Component #${this._id}</h3>
          <span aria-hidden="true">👶</span>
        </div>
        
        <div class="message-container" aria-live="polite">
          <p>Parent says: <span class="parent-message">${this.getAttribute('message') || 'Nothing yet'}</span></p>
        </div>
        
        <div class="responses">
          <button class="respond-yes" aria-label="Respond with yes I will">Respond "Yes, I will!"</button>
          <button class="respond-no" aria-label="Respond with not now">Respond "Not now!"</button>
        </div>
      </div>
    `;
    
    // Add event listeners
    this.shadowRoot.querySelector('.respond-yes').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('child-response', {
        bubbles: true,
        composed: true, // this is needed to cross shadow DOM boundaries
        detail: { response: 'Yes, I will!' }
      }));
    });
    
    this.shadowRoot.querySelector('.respond-no').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('child-response', {
        bubbles: true,
        composed: true,
        detail: { response: 'Not now!' }
      }));
    });
  }
  
  disconnectedCallback() {
    console.log(`👶 Child Component #${this._id}: Goodbye!`);
  }
}

// Register the components
customElements.define('parent-component', ParentComponent);
customElements.define('child-component', ChildComponent);
