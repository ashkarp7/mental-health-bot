// src/services/llmApi.js
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

// Mock responses for development/fallback
const mockResponses = {
  happy: [
    "I'm so glad to hear you're feeling happy! 😊 That's wonderful. What's bringing you joy today?",
    "Your happiness is contagious! ✨ It's beautiful to see you in such a positive state.",
    "I love hearing about your good mood! 🌟 Would you like to share what's making you feel so great?"
  ],
  sad: [
    "I hear that you're feeling sad, and I want you to know that it's okay to feel this way. 💙 Your feelings are valid.",
    "I'm here with you in this difficult moment. 🤗 Sadness can feel overwhelming, but you're not alone.",
    "Thank you for sharing how you're feeling with me. 💝 Sometimes just expressing our sadness can help a little."
  ],
  anxious: [
    "I understand you're feeling anxious right now. 🫂 Let's take this one step at a time. Can you tell me what's on your mind?",
    "Anxiety can feel really overwhelming. 💚 Remember that you're safe right now, and we can work through this together.",
    "I'm here to support you through this anxious feeling. 🌿 Would some breathing exercises help right now?"
  ],
  stressed: [
    "I can sense you're feeling stressed. 😔 That must be really challenging. What's been weighing on you lately?",
    "Stress can feel like a heavy burden. 🌧️ You're doing your best, and that's enough. Let's talk about what's troubling you.",
    "I hear the stress in your message. 💪 You're stronger than you know, and we'll get through this together."
  ],
  neutral: [
    "I'm here to listen and support you. 🤗 How are you feeling today?",
    "Thank you for sharing with me. 💭 I'm here to provide a safe space for you to express yourself.",
    "I appreciate you reaching out. 🌱 Whatever you're going through, you don't have to face it alone."
  ]
};

// Function to detect mood from user message
const detectMood = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Anxiety keywords
  if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || 
      lowerMessage.includes('panic') || lowerMessage.includes('nervous') ||
      lowerMessage.includes('anxiety') || lowerMessage.includes('scared')) {
    return 'anxious';
  }
  
  // Sadness keywords
  if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || 
      lowerMessage.includes('down') || lowerMessage.includes('cry') ||
      lowerMessage.includes('lonely') || lowerMessage.includes('hurt')) {
    return 'sad';
  }
  
  // Stress keywords
  if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed') || 
      lowerMessage.includes('tired') || lowerMessage.includes('exhausted') ||
      lowerMessage.includes('pressure') || lowerMessage.includes('burden')) {
    return 'stressed';
  }
  
  // Happiness keywords
  if (lowerMessage.includes('happy') || lowerMessage.includes('great') || 
      lowerMessage.includes('excited') || lowerMessage.includes('amazing') ||
      lowerMessage.includes('wonderful') || lowerMessage.includes('good')) {
    return 'happy';
  }
  
  return 'neutral';
};

// Function to get empathetic response
const getEmpatheticResponse = (userMessage, currentMood) => {
  const detectedMood = detectMood(userMessage);
  const mood = currentMood || detectedMood;
  
  const responses = mockResponses[mood] || mockResponses.neutral;
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return randomResponse;
};

// Groq API call
const callGroqAPI = async (userMessage, currentMood, conversationHistory) => {
  console.log('Making Groq API call...');
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile', // Free Groq model
      messages: [
        {
          role: 'system',
          content: `You are MindfulBot, a compassionate mental health support AI. Your role is to:
          - Be empathetic and understanding
          - Validate the user's feelings without judgment
          - Provide gentle support and encouragement
          - Ask thoughtful questions to help them process emotions
          - Suggest simple wellness activities (breathing exercises, journaling, mindfulness)
          - Never give medical advice or diagnose
          - Suggest professional help when appropriate
          - Be warm, caring, and supportive
          - Use appropriate emojis to convey warmth and empathy
          
          Current user mood: ${currentMood || 'unknown'}
          
          Keep responses conversational, supportive, and around 2-3 sentences. Focus on being a caring listener and gentle guide.`
        },
        ...conversationHistory.slice(-5).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
      top_p: 1,
      stream: false
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Groq API Error:', errorData);
    throw new Error(`Groq API Error: ${errorData.error?.message || response.statusText || 'Unknown error'}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid response format from Groq API');
  }
  
  return data.choices[0].message.content.trim();
};

// Main API call function
export const callLLMAPI = async (userMessage, currentMood = null, conversationHistory = []) => {
  try {
    console.log('Groq API Key present:', !!GROQ_API_KEY);
    console.log('API Key starts with gsk_:', GROQ_API_KEY?.startsWith('gsk_'));
    
    // Use mock responses if no API key
    if (!GROQ_API_KEY) {
      console.log('Using mock responses - no Groq API key found');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      return getEmpatheticResponse(userMessage, currentMood);
    }

    // Validate API key format
    if (!GROQ_API_KEY.startsWith('gsk_')) {
      console.warn('Invalid Groq API key format - using mock responses');
      return getEmpatheticResponse(userMessage, currentMood);
    }

    // Make Groq API call
    const response = await callGroqAPI(userMessage, currentMood, conversationHistory);
    console.log('Groq API call successful');
    return response;
    
  } catch (error) {
    console.error('Groq API Error:', error);
    
    // Fallback to mock response on error
    console.log('Falling back to mock response due to error');
    return getEmpatheticResponse(userMessage, currentMood);
  }
};

// Test function to verify Groq API connection
export const testGroqConnection = async () => {
  try {
    if (!GROQ_API_KEY) {
      return { success: false, error: 'No API key found' };
    }

    const response = await callGroqAPI('Hello, are you working?', null, []);
    return { success: true, response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Alternative API providers (Hugging Face example)
export const callHuggingFaceAPI = async (userMessage) => {
  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
      {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: {
            past_user_inputs: [],
            generated_responses: [],
            text: userMessage
          }
        }),
      }
    );

    const data = await response.json();
    return data.generated_text || getEmpatheticResponse(userMessage);
    
  } catch (error) {
    console.error('Hugging Face API Error:', error);
    return getEmpatheticResponse(userMessage);
  }
};

export default callLLMAPI;
