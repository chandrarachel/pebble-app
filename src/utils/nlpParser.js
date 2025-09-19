const API_KEY = process.env.EXPO_PUBLIC_BEDROCK_API_KEY

async function parseReminderTextGPT(text) {
  const completion = await fetch("https://bedrock-runtime.us-east-1.amazonaws.com/model/us.amazon.nova-pro-v1:0/converse", {
    method: "POST",
    headers: {
      'Authorization': "Bearer " + API_KEY
    },
    body: JSON.stringify({
      response_type: {text: "json_object"},
      system: [{text: `You are a chatbot for a reminder app. Check what reminder the client wants and return it as JSON like the following: 
        ${JSON.stringify({
          title: "Name of the task",
          priority: "LOW, MEDIUM, HIGH depending on the urgency/priority of the request",
          timeInfo: "Time the user wants the request to be fulfilled, in yyyy-mm-ddThh:mm:ss format, for reference, now is " + new Date().toISOString(),
          locationInfo: "A general place name where the request can be fulfilled",
        })}

        if the customer doesn't talk anything about task, just respond formally, prompting for a task, in the following format
        ${
          JSON.stringify({
            error: "Your message here"  
          })
        }

        `}],
      messages: [
        {role: "user", content: [{text: text}]}
      ]
    })
  }).catch(console.log)
  /**
   * @type {{title: string, priority: string, timeInfo: string, locationInfo: string} | {text: string}}
   */
  const val = JSON.parse((await completion.json()).output.message.content[0].text)
  return val
}

// Simple NLP parser for reminder creation
export const parseReminderText = async (text) => {
  const obj = await parseReminderTextGPT(text)
  console.log(obj)
  if ('error' in obj) return obj

  console.log("Object is proper, now we continue execution")
  return {
    title: obj.title,
    priority: obj.priority,
    timeInfo: obj.timeInfo,
    locationInfo: obj.locationInfo,
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