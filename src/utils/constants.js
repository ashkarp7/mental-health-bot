// src/utils/constants.js

// Mood definitions with emojis and colors
export const moods = {
  happy: {
    name: 'Happy',
    emoji: '😊',
    color: 'bg-yellow-100 text-yellow-800',
    borderColor: 'border-yellow-300',
    description: 'Feeling joyful and positive'
  },
  sad: {
    name: 'Sad',
    emoji: '😢',
    color: 'bg-blue-100 text-blue-800',
    borderColor: 'border-blue-300',
    description: 'Feeling down or melancholy'
  },
  anxious: {
    name: 'Anxious',
    emoji: '😰',
    color: 'bg-red-100 text-red-800',
    borderColor: 'border-red-300',
    description: 'Feeling worried or nervous'
  },
  stressed: {
    name: 'Stressed',
    emoji: '🤯',
    color: 'bg-orange-100 text-orange-800',
    borderColor: 'border-orange-300',
    description: 'Feeling overwhelmed or pressured'
  },
  calm: {
    name: 'Calm',
    emoji: '😌',
    color: 'bg-green-100 text-green-800',
    borderColor: 'border-green-300',
    description: 'Feeling peaceful and relaxed'
  },
  excited: {
    name: 'Excited',
    emoji: '🤩',
    color: 'bg-purple-100 text-purple-800',
    borderColor: 'border-purple-300',
    description: 'Feeling energetic and enthusiastic'
  },
  tired: {
    name: 'Tired',
    emoji: '😴',
    color: 'bg-gray-100 text-gray-800',
    borderColor: 'border-gray-300',
    description: 'Feeling exhausted or sleepy'
  },
  confused: {
    name: 'Confused',
    emoji: '🤔',
    color: 'bg-indigo-100 text-indigo-800',
    borderColor: 'border-indigo-300',
    description: 'Feeling uncertain or puzzled'
  },
  grateful: {
    name: 'Grateful',
    emoji: '🙏',
    color: 'bg-pink-100 text-pink-800',
    borderColor: 'border-pink-300',
    description: 'Feeling thankful and appreciative'
  },
  neutral: {
    name: 'Neutral',
    emoji: '😐',
    color: 'bg-gray-100 text-gray-600',
    borderColor: 'border-gray-300',
    description: 'Feeling balanced or indifferent'
  }
};

// Wellness activities
export const wellnessActivities = {
  breathing: {
    name: 'Breathing Exercise',
    icon: '🫁',
    duration: '2-5 minutes',
    description: 'Deep breathing to reduce stress and anxiety',
    benefits: ['Reduces anxiety', 'Lowers heart rate', 'Improves focus']
  },
  meditation: {
    name: 'Meditation',
    icon: '🧘',
    duration: '5-20 minutes',
    description: 'Mindfulness practice to center yourself',
    benefits: ['Increases awareness', 'Reduces stress', 'Improves emotional regulation']
  },
  gratitude: {
    name: 'Gratitude Practice',
    icon: '📝',
    duration: '3-10 minutes',
    description: 'Write down things you\'re grateful for',
    benefits: ['Improves mood', 'Increases positivity', 'Better sleep']
  },
  movement: {
    name: 'Gentle Movement',
    icon: '🚶',
    duration: '5-15 minutes',
    description: 'Light stretching or walking',
    benefits: ['Boosts energy', 'Releases tension', 'Improves circulation']
  },
  grounding: {
    name: '5-4-3-2-1 Grounding',
    icon: '🌱',
    duration: '3-5 minutes',
    description: 'Sensory grounding technique for anxiety',
    benefits: ['Reduces anxiety', 'Brings focus to present', 'Calms nervous system']
  }
};

// Crisis resources
export const crisisResources = {
  national: {
    name: 'National Suicide Prevention Lifeline',
    phone: '988',
    text: null,
    website: 'https://suicidepreventionlifeline.org',
    description: '24/7 free and confidential support'
  },
  crisis: {
    name: 'Crisis Text Line',
    phone: null,
    text: '741741',
    textMessage: 'HOME',
    website: 'https://www.crisistextline.org',
    description: 'Free, 24/7 support via text message'
  },
  emergency: {
    name: 'Emergency Services',
    phone: '911',
    text: null,
    website: null,
    description: 'For immediate medical emergencies'
  },
  samhsa: {
    name: 'SAMHSA Helpline',
    phone: '1-800-662-4357',
    text: null,
    website: 'https://www.samhsa.gov/find-help/national-helpline',
    description: 'Treatment referral and information service'
  }
};

// App configuration
export const appConfig = {
  name: 'MindfulAI',
  version: '1.0.0',
  description: 'Your compassionate AI mental health companion',
  maxMessageLength: 500,
  maxVoiceRecordingTime: 60, // seconds
  autoSaveInterval: 30000, // 30 seconds
  moodReminderInterval: 3600000, // 1 hour
  maxChatHistory: 50,
  supportedLanguages: ['en-US', 'en-GB'],
  features: {
    voiceInput: true,
    textToSpeech: true,
    moodTracking: true,
    wellnessTools: true,
    chatHistory: true,
    dataExport: true
  }
};

// Theme colors
export const themes = {
  light: {
    primary: 'bg-white',
    secondary: 'bg-gray-50',
    accent: 'bg-purple-500',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200'
  },
  dark: {
    primary: 'bg-gray-900',
    secondary: 'bg-gray-800',
    accent: 'bg-purple-600',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    border: 'border-gray-700'
  }
};

// Message types
export const messageTypes = {
  USER: 'user',
  AI: 'ai',
  SYSTEM: 'system',
  MOOD_UPDATE: 'mood_update',
  WELLNESS_ACTIVITY: 'wellness_activity'
};

// Breathing exercise patterns
export const breathingPatterns = {
  basic: {
    name: 'Basic Breathing',
    inhale: 4,
    hold: 4,
    exhale: 4,
    cycles: 6,
    description: 'Simple 4-4-4 breathing pattern'
  },
  deep: {
    name: 'Deep Relaxation',
    inhale: 4,
    hold: 7,
    exhale: 8,
    cycles: 4,
    description: '4-7-8 breathing for deep relaxation'
  },
  energizing: {
    name: 'Energizing Breath',
    inhale: 6,
    hold: 2,
    exhale: 4,
    cycles: 8,
    description: 'Energizing breath pattern'
  },
  anxiety: {
    name: 'Anxiety Relief',
    inhale: 3,
    hold: 3,
    exhale: 6,
    cycles: 5,
    description: 'Longer exhale for anxiety relief'
  }
};

// Wellness tips categories
export const wellnessTipsCategories = {
  daily: [
    "Start your day with 3 deep breaths",
    "Drink water regularly throughout the day",
    "Take short breaks every hour",
    "Practice gratitude - name 3 good things",
    "Limit caffeine after 2 PM for better sleep",
    "Spend 10 minutes in nature if possible"
  ],
  stress: [
    "Use the 5-4-3-2-1 grounding technique",
    "Try progressive muscle relaxation",
    "Break large tasks into smaller steps",
    "Practice saying 'no' to overwhelming requests",
    "Create a calming evening routine",
    "Listen to soothing music or sounds"
  ],
  anxiety: [
    "Focus on what you can control",
    "Challenge negative thought patterns",
    "Use breathing exercises when feeling anxious",
    "Create a worry time - 15 minutes daily",
    "Practice mindfulness meditation",
    "Keep a anxiety trigger journal"
  ],
  mood: [
    "Move your body - even light exercise helps",
    "Connect with supportive friends or family",
    "Engage in activities you enjoy",
    "Maintain a regular sleep schedule",
    "Eat nutritious meals regularly",
    "Limit alcohol and processed foods"
  ],
  emergency: [
    "If you're having thoughts of self-harm, reach out immediately",
    "Call 988 for the National Suicide Prevention Lifeline",
    "Text HOME to 741741 for Crisis Text Line",
    "Go to your nearest emergency room if in immediate danger",
    "Call a trusted friend, family member, or therapist",
    "Remember: these feelings are temporary and help is available"
  ]
};

// Validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
  name: /^[a-zA-Z\s]{2,50}$/
};

// Error messages
export const errorMessages = {
  auth: {
    invalidEmail: 'Please enter a valid email address',
    invalidPassword: 'Password must be at least 6 characters with letters and numbers',
    invalidName: 'Name must be 2-50 characters and contain only letters',
    passwordMismatch: 'Passwords do not match',
    userExists: 'An account with this email already exists',
    userNotFound: 'No account found with this email',
    invalidCredentials: 'Invalid email or password',
    registrationFailed: 'Registration failed. Please try again.',
    loginFailed: 'Login failed. Please try again.'
  },
  voice: {
    notSupported: 'Voice recognition is not supported in this browser',
    permissionDenied: 'Microphone permission denied',
    noSpeech: 'No speech detected. Please try again.',
    networkError: 'Network error. Please check your connection.',
    microphoneError: 'Microphone error. Please check your device.'
  },
  general: {
    networkError: 'Network error. Please check your connection.',
    storageError: 'Error saving data. Please try again.',
    unknownError: 'An unexpected error occurred. Please try again.'
  }
};

export default {
  moods,
  wellnessActivities,
  crisisResources,
  appConfig,
  themes,
  messageTypes,
  breathingPatterns,
  wellnessTipsCategories,
  validationPatterns,
  errorMessages
};

