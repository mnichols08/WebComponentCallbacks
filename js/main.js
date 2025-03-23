// Import our custom components and utilities
import { setupConsoleLogger } from './consoleLogger.js';
import { setupAccessibilityDebugging, checkAccessibility } from './debugControls.js';
import './components/birthdayComponent.js';
import './components/cleanupComponent.js';
import './components/moodRingComponent.js';
import './components/adoptedPetComponent.js';
import { applyContrastText } from './colorUtils.js';

// Import communication components
import './components/communication/FamilyTalkComponents.js';
import './components/communication/SiblingTalkComponents.js';
import './components/communication/GlobalTalkComponents.js';

// Set up console logger and UI when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Set up the console logger and get the filter controller
  const consoleController = setupConsoleLogger();
  
  // Setup accessibility debugging tools in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    setupAccessibilityDebugging();
  }
  
  // UI Event Handlers for Birthday Components
  document.getElementById('add-birthday').addEventListener('click', () => {
    const container = document.getElementById('birthday-container');
    const component = document.createElement('birthday-card');
    container.appendChild(component);
  });

  document.getElementById('remove-all-birthday').addEventListener('click', () => {
    const container = document.getElementById('birthday-container');
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  });
  
  // UI Event Handlers for Cleanup Components
  document.getElementById('add-cleanup').addEventListener('click', () => {
    const container = document.getElementById('cleanup-container');
    const component = document.createElement('cleanup-demo');
    container.appendChild(component);
  });

  document.getElementById('remove-all-cleanup').addEventListener('click', () => {
    const container = document.getElementById('cleanup-container');
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  });
  
  // UI Event Handlers for Mood Ring Components
  document.getElementById('add-mood').addEventListener('click', () => {
    const container = document.getElementById('mood-container');
    const component = document.createElement('mood-ring');
    
    // Set a random initial mood
    const moods = ['happy', 'sad', 'angry', 'confused', 'neutral'];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    
    // First append to DOM, then set attribute to ensure component is connected
    container.appendChild(component);
    
    // Use setTimeout to ensure the component is fully initialized
    setTimeout(() => {
      component.setAttribute('mood', randomMood);
    }, 0);
  });

  document.getElementById('remove-all-mood').addEventListener('click', () => {
    const container = document.getElementById('mood-container');
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  });
  
  // UI Event Handlers for Adoption Papers Components
  document.getElementById('add-adopted').addEventListener('click', () => {
    const container = document.getElementById('adopted-container');
    const component = document.createElement('adopted-pet');
    container.appendChild(component);
  });

  document.getElementById('remove-all-adopted').addEventListener('click', () => {
    // Clear both shelter and forever homes containers
    const shelterContainer = document.getElementById('adopted-container');
    const homesContainer = document.getElementById('forever-homes-container');
    
    while (shelterContainer.firstChild) {
      shelterContainer.removeChild(shelterContainer.firstChild);
    }
    
    while (homesContainer.firstChild) {
      homesContainer.removeChild(homesContainer.firstChild);
    }
  });
  
  document.getElementById('batch-adopt').addEventListener('click', () => {
    const pets = document.querySelectorAll('#adopted-container > adopted-pet');
    if (pets.length === 0) {
      console.log('No pets available to adopt! Add some first.');
      return;
    }
    
    console.log(`🏠 Batch adopting ${pets.length} pets to a new home!`);
    
    // Create a temporary document to move all pets to
    const tempDoc = document.implementation.createHTMLDocument('Batch Adoption');
    
    // Set the adoption flag on all pets before moving them
    pets.forEach(pet => {
      pet._isBeingAdopted = true;
    });
    
    // Move all pets to trigger adoptedCallback for each
    pets.forEach(pet => {
      tempDoc.body.appendChild(pet);
    });
    
    // After a short delay, return them to the forever homes container
    setTimeout(() => {
      const container = document.getElementById('forever-homes-container');
      if (container) {
        while (tempDoc.body.firstChild) {
          container.appendChild(tempDoc.body.firstChild);
        }
      }
    }, 100);
  });
  
  // Global mood change buttons - Fix event handling
  const moodButtons = document.querySelectorAll('.mood-buttons .mood-button');
  moodButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent any parent handlers from firing
      const newMood = button.dataset.mood;
      console.log(`Global mood change: Setting all rings to ${newMood}`);
      
      document.querySelectorAll('mood-ring').forEach(ring => {
        ring.setAttribute('mood', newMood);
      });
    });
  });
  
  // Tab switching functionality - enhanced for accessibility
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class and update ARIA attributes for all tabs
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      
      // Add active class and update ARIA for clicked tab
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      
      // Hide all tab content
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        content.setAttribute('hidden', '');
      });
      
      // Show selected tab content
      const tabId = `${tab.dataset.tab}-tab`;
      const tabPanel = document.getElementById(tabId);
      tabPanel.classList.add('active');
      tabPanel.removeAttribute('hidden');
      
      // Set the console filter based on the current tab
      const tabType = tab.dataset.tab;
      consoleController.setActiveFilter(tabType);
      
      // Log tab change to help debug
      console.log(`Switched to ${tabType} tab`);
    });
    
    // Handle keyboard navigation for tabs
    tab.addEventListener('keydown', (e) => {
      let nextTab;
      
      switch (e.key) {
        case 'ArrowRight':
          nextTab = tab.nextElementSibling || tabs[0];
          break;
        case 'ArrowLeft':
          nextTab = tab.previousElementSibling || tabs[tabs.length - 1];
          break;
        default:
          return;
      }
      
      if (nextTab && nextTab.classList.contains('tab')) {
        e.preventDefault();
        nextTab.focus();
        nextTab.click();
      }
    });
  });
  
  // Handle the "show all logs" checkbox
  const showAllLogsCheckbox = document.getElementById('show-all-logs');
  showAllLogsCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
      consoleController.setActiveFilter('all');
    } else {
      // Revert to the current tab filter
      const activeTab = document.querySelector('.tab.active');
      if (activeTab) {
        consoleController.setActiveFilter(activeTab.dataset.tab);
      }
    }
  });
  
  // Initialize with the default tab's filter
  const activeTab = document.querySelector('.tab.active');
  if (activeTab) {
    consoleController.setActiveFilter(activeTab.dataset.tab);
  }
  
  // Add check for accessibility issues
  setTimeout(() => {
    const accessibilityIssues = checkAccessibility();
    if (accessibilityIssues.length > 0) {
      console.warn('Accessibility issues detected:', accessibilityIssues);
    } else {
      console.log('No basic accessibility issues detected.');
    }
  }, 2000);
  
  // Setup text contrast enhancement
  enhanceTextContrast();
});

// Add contrast enhancement for all components
function enhanceTextContrast() {
  // For all component elements that need contrast management
  document.querySelectorAll('.contrast-monitor').forEach(el => {
    // Get computed background color
    const bgColor = window.getComputedStyle(el).backgroundColor;
    applyContrastText(el, bgColor);
  });
  
  // Apply to any dynamically created elements as well
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            if (node.classList.contains('contrast-monitor')) {
              setTimeout(() => {
                const bgColor = window.getComputedStyle(node).backgroundColor;
                applyContrastText(node, bgColor);
              }, 10);
            }
            
            // Also check children
            node.querySelectorAll('.contrast-monitor').forEach(child => {
              setTimeout(() => {
                const bgColor = window.getComputedStyle(child).backgroundColor;
                applyContrastText(child, bgColor);
              }, 10);
            });
          }
        });
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}
