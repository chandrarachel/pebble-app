// Simple NLP parser for reminder creation
export const parseReminderText = (text) => {
  const lowercaseText = text.toLowerCase();
  
  // Extract priority keywords
  const getPriority = () => {
    if (lowercaseText.includes('urgent') || lowercaseText.includes('important') || lowercaseText.includes('asap')) {
      return 'HIGH';
    }
    if (lowercaseText.includes('later') || lowercaseText.includes('sometime') || lowercaseText.includes('eventually')) {
      return 'LOW';
    }
    return 'MEDIUM';
  };

  // Extract time-related keywords
  const extractTime = () => {
    const timePatterns = [
      /at (\d{1,2}):?(\d{2})?\s*(am|pm)?/i,
      /(\d{1,2})\s*(am|pm)/i,
      /(morning|afternoon|evening|night)/i,
      /(today|tomorrow|this week|next week)/i
    ];
    
    for (const pattern of timePatterns) {
      const match = text.match(pattern);
      if (match) return match[0];
    }
    return null;
  };

  // Extract location keywords
  const extractLocation = () => {
    const locationPatterns = [
      /at (the )?([a-zA-Z\s]+)/i,
      /when I'm at ([a-zA-Z\s]+)/i,
      /near ([a-zA-Z\s]+)/i,
      /(grocery store|supermarket|mall|office|home|work|gym|school)/i
    ];
    
    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match) return match[match.length - 1];
    }
    return null;
  };

  // Extract the main task
  const extractTask = () => {
    const taskPatterns = [
      /remind me to (.+)/i,
      /I need to (.+)/i,
      /don't forget to (.+)/i,
      /(.+) when I/i
    ];
    
    for (const pattern of taskPatterns) {
      const match = text.match(pattern);
      if (match) {
        let task = match[1];
        // Clean up the task by removing location and time info
        task = task.replace(/\s+(at|when|near).+$/i, '');
        task = task.replace(/\s+(today|tomorrow|this week|next week).+$/i, '');
        return task.trim();
      }
    }
    return text; // fallback to original text
  };

  return {
    title: extractTask(),
    priority: getPriority(),
    timeInfo: extractTime(),
    locationInfo: extractLocation(),
    originalText: text
  };
};

// Generate bot responses based on parsed data
export const generateBotResponse = (parsedData) => {
  const { title, priority, timeInfo, locationInfo } = parsedData;
  
  let response = `I'll create a reminder for "${title}"`;
  
  if (locationInfo) {
    response += ` at ${locationInfo}`;
  }
  
  if (timeInfo) {
    response += ` ${timeInfo}`;
  }
  
  response += `. Priority: ${priority.toLowerCase()}. 📍`;
  
  return response;
};