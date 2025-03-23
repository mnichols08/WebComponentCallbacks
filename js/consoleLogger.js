// Custom console logger that captures console.log to display in our custom console
export function setupConsoleLogger() {
  // Track the current active tab/filter
  let activeFilter = 'birthday'; // Default to birthday tab
  const logBuffer = [];
  const MAX_LOGS = 100; // Limit number of stored logs
  
  // Function to set active filter
  const setActiveFilter = (filter) => {
    activeFilter = filter;
    refreshConsoleOutput();
  };
  
  // Function to refresh the console output based on current filter
  const refreshConsoleOutput = () => {
    const output = document.getElementById('console-output');
    output.innerHTML = ''; // Clear current output
    
    // Add only logs for the current filter
    logBuffer.forEach(entry => {
      if (entry.type === activeFilter || activeFilter === 'all') {
        output.appendChild(entry.element);
      }
    });
    
    // Scroll to the bottom
    output.scrollTop = output.scrollHeight;
  };
  
  // Override console.log
  const originalConsoleLog = console.log;
  console.log = function(...args) {
    originalConsoleLog.apply(console, args);
    
    const message = args.map(arg => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg);
      }
      return arg;
    }).join(' ');
    
    // Create the log entry element
    const logEntry = document.createElement('div');
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logEntry.classList.add('log-entry');
    
    // Determine the type of log by its content
    let logType = 'other';
    if (message.includes('Birthday') || message.includes('party')) {
      logEntry.classList.add('birthday');
      logType = 'birthday';
    } else if (message.includes('Cleanup') || message.includes('farewell')) {
      logEntry.classList.add('cleanup');
      logType = 'cleanup';
    } else if (message.includes('Mood') || message.includes('mood')) {
      logEntry.classList.add('mood');
      logType = 'mood';
    } else if (message.includes('Global mood change')) {
      logEntry.classList.add('mood');
      logType = 'mood';
    } else if (message.includes('Adoption') || message.includes('Pet #') || 
               message.includes('adopted') || message.includes('shelter')) {
      logEntry.classList.add('adopted');
      logType = 'adopted';
    } 
    // Communication-related logs
    else if (message.includes('Parent Component') || message.includes('Child Component')) {
      logEntry.classList.add('communication');
      logType = 'communication';
    } else if (message.includes('Sibling Container') || message.includes('Sender') || 
               message.includes('Receiver')) {
      logEntry.classList.add('communication');
      logType = 'communication';
    } else if (message.includes('Global Sender') || message.includes('Global Listener') || 
               message.includes('Dispatched') || message.includes('broadcast')) {
      logEntry.classList.add('communication');
      logType = 'communication';
    }
    
    // Store the log entry in our buffer
    logBuffer.push({
      type: logType,
      element: logEntry,
      timestamp: Date.now()
    });
    
    // Trim buffer if it gets too large
    if (logBuffer.length > MAX_LOGS) {
      logBuffer.shift();
    }
    
    // Only add to display if it matches the current filter
    if (logType === activeFilter || activeFilter === 'all') {
      const output = document.getElementById('console-output');
      output.appendChild(logEntry);
      output.scrollTop = output.scrollHeight;
    }
  };
  
  // Expose the filter setter for external use
  return {
    setActiveFilter
  };
}
