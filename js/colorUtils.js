/**
 * Utility functions for color management and accessibility
 */

/**
 * Determines if a color is light or dark
 * @param {string} color - Hex color code
 * @returns {boolean} True if color is light, false if dark
 */
export function isLightColor(color) {
  // Remove the hash at the start if it exists
  color = color.replace(/^#/, '');
  
  // Parse the color
  let r, g, b;
  if (color.length === 3) {
    // Short hex format (e.g. #ABC)
    r = parseInt(color.charAt(0) + color.charAt(0), 16);
    g = parseInt(color.charAt(1) + color.charAt(1), 16);
    b = parseInt(color.charAt(2) + color.charAt(2), 16);
  } else if (color.length === 6) {
    // Full hex format (e.g. #AABBCC)
    r = parseInt(color.substring(0, 2), 16);
    g = parseInt(color.substring(2, 4), 16);
    b = parseInt(color.substring(4, 6), 16);
  } else {
    // Handle RGB format or other non-hex cases
    try {
      if (color.startsWith('rgb')) {
        const rgbValues = color.match(/\d+/g);
        if (rgbValues && rgbValues.length >= 3) {
          r = parseInt(rgbValues[0]);
          g = parseInt(rgbValues[1]);
          b = parseInt(rgbValues[2]);
        } else {
          return true; // Default to light if we can't parse
        }
      } else {
        return true; // Default to light for unknown formats
      }
    } catch (e) {
      console.warn('Could not parse color:', color);
      return true; // Default to light
    }
  }
  
  // Calculate the perceived brightness using the YIQ formula
  // This gives better results than simply averaging RGB values
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  // YIQ < 128 is considered dark, >= 128 is light
  return yiq >= 128;
}

/**
 * Gets the appropriate text color (black or white) for a given background color
 * @param {string} backgroundColor - Background color in hex format
 * @returns {string} - Either "black" or "white"
 */
export function getContrastTextColor(backgroundColor) {
  return isLightColor(backgroundColor) ? 'black' : 'white';
}

/**
 * Applies the appropriate text color to all elements within a container
 * @param {HTMLElement} container - The container element
 * @param {string} backgroundColor - Background color in hex format
 */
export function applyContrastText(container, backgroundColor) {
  const textColor = getContrastTextColor(backgroundColor);
  container.style.color = textColor;
  
  // Also handle links and other text elements that might need contrast
  const links = container.querySelectorAll('a');
  links.forEach(link => {
    link.style.color = textColor === 'white' ? '#9cceff' : '#0066cc';
  });
}
