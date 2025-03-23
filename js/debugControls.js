/**
 * Utility functions for debugging and improving accessibility
 */

export function setupAccessibilityDebugging() {
  // Add a button to the page to toggle high contrast mode for testing
  const debugButton = document.createElement('button');
  debugButton.textContent = 'Toggle High Contrast';
  debugButton.className = 'a11y-debug-btn';
  debugButton.style.position = 'fixed';
  debugButton.style.bottom = '20px';
  debugButton.style.right = '20px';
  debugButton.setAttribute('aria-pressed', 'false');
  
  let highContrastMode = false;
  
  // Check if user prefers high contrast
  if (window.matchMedia('(prefers-contrast: more)').matches) {
    highContrastMode = true;
    document.body.classList.add('high-contrast');
    debugButton.classList.add('active');
    debugButton.setAttribute('aria-pressed', 'true');
  }
  
  debugButton.addEventListener('click', () => {
    highContrastMode = !highContrastMode;
    debugButton.setAttribute('aria-pressed', highContrastMode ? 'true' : 'false');
    
    if (highContrastMode) {
      document.body.classList.add('high-contrast');
      debugButton.classList.add('active');
      localStorage.setItem('high-contrast-mode', 'enabled');
    } else {
      document.body.classList.remove('high-contrast');
      debugButton.classList.remove('active');
      localStorage.setItem('high-contrast-mode', 'disabled');
    }
  });
  
  // Check localStorage for saved preference
  const savedPreference = localStorage.getItem('high-contrast-mode');
  if (savedPreference === 'enabled') {
    highContrastMode = true;
    document.body.classList.add('high-contrast');
    debugButton.classList.add('active');
    debugButton.setAttribute('aria-pressed', 'true');
  }
  
  document.body.appendChild(debugButton);
  
  // Log accessibility issues to console
  console.log('Accessibility debugging enabled. Use the button in the bottom right to toggle high contrast mode.');
  
  // Add keyboard shortcut for high contrast mode (Alt+Shift+C)
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && e.key === 'C') {
      debugButton.click();
      console.log(highContrastMode ? 'High contrast mode enabled' : 'High contrast mode disabled');
    }
  });
}

export function checkAccessibility() {
  // Simple function to check for basic accessibility issues
  const issues = [];
  
  // Check for images without alt text
  const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
  if (imagesWithoutAlt.length > 0) {
    issues.push(`Found ${imagesWithoutAlt.length} images missing alt attributes`);
  }
  
  // Check for buttons without accessible names
  const buttonsWithoutText = Array.from(document.querySelectorAll('button')).filter(
    btn => !btn.textContent.trim() && !btn.getAttribute('aria-label') && !btn.getAttribute('title')
  );
  if (buttonsWithoutText.length > 0) {
    issues.push(`Found ${buttonsWithoutText.length} buttons missing accessible names`);
  }
  
  // Check for color contrast issues (simplified check)
  const elementsWithLowContrast = document.querySelectorAll('.low-contrast');
  if (elementsWithLowContrast.length > 0) {
    issues.push(`Found ${elementsWithLowContrast.length} elements with potentially low contrast`);
  }
  
  return issues;
}
