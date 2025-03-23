# Web Components Lifecycle Demo

A comprehensive demonstration of Web Components lifecycle methods and communication patterns. This project showcases various aspects of the Web Components API and how custom elements can interact with each other.

## Overview

This demo application provides interactive examples of:

- Web Component lifecycle callbacks
- Cleanup and resource management
- Attribute observation and reactions
- Node adoption in the DOM
- Various communication patterns between components

## Installation

1. Clone the repository
2. No build step required - this is a vanilla JavaScript project
3. Open `index.html` in a browser or use a local development server

```bash
# Using Node.js http-server (install globally if needed)
npm install -g http-server
http-server

# Or with npx
npx http-server
```

## Demo Sections

### Birthday Component

Demonstrates the basic lifecycle callbacks of Web Components including `constructor()`, `connectedCallback()`, and `disconnectedCallback()`.

### Farewell Tour Component

Shows proper resource cleanup and memory management in the `disconnectedCallback()` lifecycle method.

### Mood Ring Component

Illustrates the `attributeChangedCallback()` and how components can react to attribute changes. Contains interactive mood-changing functionality.

### Adoption Papers Component

Demonstrates the `adoptedCallback()` lifecycle method that triggers when a component is moved between documents.

### Component Communication

Showcases three different communication patterns for Web Components:

1. **Parent-Child Communication**: Direct property and event-based communication between parent and child components
2. **Sibling Communication**: How components at the same level can communicate via a shared parent
3. **Global Event Bus**: Using a centralized event bus to allow any component to communicate with any other component

## Console Output

The demo includes a console output section that displays lifecycle events as they occur, making it easy to understand the sequence of callbacks and how they relate to user interactions.

## Web Component Lifecycle Methods

This demo showcases all the standard lifecycle callbacks:

- **constructor()**: Called when an instance of the element is created
- **connectedCallback()**: Invoked when the element is added to the document
- **disconnectedCallback()**: Invoked when the element is removed from the document
- **attributeChangedCallback()**: Called when an observed attribute is changed
- **adoptedCallback()**: Invoked when the element is moved to a new document
