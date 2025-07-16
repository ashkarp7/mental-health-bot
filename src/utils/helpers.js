// src/utils/helpers.js
import { moods, validationPatterns } from './constants';

// Date and time utilities
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
  
  return date.toLocaleDateString();
};

export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const isToday = (timestamp) => {
  const today = new Date();
  const date = new Date(timestamp);
  return today.toDateString() === date.toDateString();
};

export const isYesterday = (timestamp) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const date = new Date(timestamp);
  return yesterday.toDateString() === date.toDateString();
};

// Validation utilities
export const validateEmail = (email) => {
  return validationPatterns.email.test(email);
};

export const validatePassword = (password) => {
  return validationPatterns.password.test(password);
};

export const validateName = (name) => {
  return validationPatterns.name.test(name);
};

export const getValidationErrors = (formData) => {
  const errors = {};
  
  if (formData.name !== undefined && !validateName(formData.name)) {
    errors.name = 'Name must be 2-50 characters and contain only letters';
  }
  
  if (formData.email !== undefined && !validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (formData.password !== undefined && !validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters with letters and numbers';
  }
  
  if (formData.confirmPassword !== undefined && formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return errors;
};

// Mood utilities
export const getMoodByName = (moodName) => {
  return moods[moodName] || moods.neutral;
};

export const getMoodColor = (moodName) => {
  const mood = getMoodByName(moodName);
  return mood.color;
};

export const getMoodEmoji = (moodName) => {
  const mood = getMoodByName(moodName);
  return mood.emoji;
};

export const detectMoodFromText = (text) => {
  const lowerText = text.toLowerCase();
  
  // Define mood keywords
  const moodKeywords = {
    happy: ['happy', 'joy', 'great', 'amazing', 'wonderful', 'excited', 'fantastic', 'good', 'positive', 'cheerful'],
    sad: ['sad', 'down', 'depressed', 'blue', 'miserable', 'heartbroken', 'disappointed', 'gloomy', 'melancholy'],
    anxious: ['anxious', 'worried', 'nervous', 'panic', 'scared', 'fearful', 'uneasy', 'apprehensive', 'tense'],
    stressed: ['stressed', 'overwhelmed', 'pressure', 'burden', 'exhausted', 'tired', 'swamped', 'frazzled'],
    calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'zen', 'centered', 'balanced'],
    excited: ['excited', 'thrilled', 'enthusiastic', 'energetic', 'pumped', 'eager', 'elated'],
    confused: ['confused', 'puzzled', 'uncertain', 'lost', 'unclear', 'bewildered', 'perplexed'],
    grateful: ['grateful', 'thankful', 'blessed', 'appreciative', 'fortunate', 'lucky']
  };
  
  let maxScore = 0;
  let detectedMood = 'neutral';
  
  Object.keys(moodKeywords).forEach(mood => {
    const keywords = moodKeywords[mood];
    let score = 0;
    
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        score++;
      }
    });
    
    if (score > maxScore) {
      maxScore = score;
      detectedMood = mood;
    }
  });
  
  return detectedMood;
};

// Text utilities
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const sanitizeInput = (input) => {
  return input.trim().replace(/[<>]/g, '');
};

export const countWords = (text) => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

// Array utilities
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = typeof key === 'function' ? key(item) : item[key];
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {});
};

// Storage utilities
export const getDataSize = (data) => {
  return new Blob([JSON.stringify(data)]).size;
};

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Color utilities
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// URL utilities
export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (let [key, value] of params) {
    result[key] = value;
  }
  return result;
};

export const setQueryParam = (key, value) => {
  const url = new URL(window.location);
  url.searchParams.set(key, value);
  window.history.pushState({}, '', url);
};

// Device utilities
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isTablet = () => {
  return /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
};

export const isDesktop = () => {
  return !isMobile() && !isTablet();
};

// Performance utilities
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Analytics utilities
export const getMoodDistribution = (moodHistory) => {
  const distribution = {};
  
  moodHistory.forEach(entry => {
    const mood = entry.mood || 'neutral';
    distribution[mood] = (distribution[mood] || 0) + 1;
  });
  
  return distribution;
};

export const getChatStatistics = (messages) => {
  const stats = {
    totalMessages: messages.length,
    userMessages: messages.filter(m => m.sender === 'user').length,
    aiMessages: messages.filter(m => m.sender === 'ai').length,
    averageWordsPerMessage: 0,
    mostActiveDay: null,
    longestStreak: 0
  };
  
  if (stats.userMessages > 0) {
    const totalWords = messages
      .filter(m => m.sender === 'user')
      .reduce((sum, m) => sum + countWords(m.text), 0);
    stats.averageWordsPerMessage = Math.round(totalWords / stats.userMessages);
  }
  
  // Group messages by date
  const messagesByDate = groupBy(messages, (msg) => 
    new Date(msg.timestamp).toDateString()
  );
  
  // Find most active day
  let maxMessages = 0;
  Object.keys(messagesByDate).forEach(date => {
    if (messagesByDate[date].length > maxMessages) {
      maxMessages = messagesByDate[date].length;
      stats.mostActiveDay = date;
    }
  });
  
  return stats;
};

// Export utilities
export const downloadJSON = (data, filename) => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  const exportFileDefaultName = filename + '.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const downloadCSV = (data, filename) => {
  const csvContent = "data:text/csv;charset=utf-8," + data;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename + ".csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Crisis detection
export const detectCrisisKeywords = (text) => {
  const crisisKeywords = [
    'suicide', 'kill myself', 'end it all', 'not worth living', 'want to die',
    'hurt myself', 'self harm', 'cutting', 'overdose', 'end my life',
    'nobody cares', 'hopeless', 'worthless', 'better off dead'
  ];
  
  const lowerText = text.toLowerCase();
  return crisisKeywords.some(keyword => lowerText.includes(keyword));
};

// Wellness utilities
export const getWellnessTip = (mood) => {
  const tips = {
    anxious: [
      "Try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8",
      "Ground yourself using the 5-4-3-2-1 technique: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste",
      "Take a warm shower or bath to help relax your muscles",
      "Write down your worries to get them out of your head"
    ],
    sad: [
      "Reach out to a friend or family member you trust",
      "Go for a walk in nature, even if it's just for 10 minutes",
      "Listen to uplifting music or watch something that makes you smile",
      "Practice gratitude by writing down 3 things you're thankful for"
    ],
    stressed: [
      "Break large tasks into smaller, manageable steps",
      "Take regular breaks throughout your day",
      "Try progressive muscle relaxation",
      "Prioritize your tasks and focus on what's most important"
    ],
    happy: [
      "Share your positive energy with others",
      "Take time to appreciate this moment",
      "Consider what led to this happiness and how to maintain it",
      "Use this energy to tackle something you've been putting off"
    ],
    neutral: [
      "Check in with yourself - how are you really feeling?",
      "Take a few deep breaths and center yourself",
      "Consider doing something kind for yourself today",
      "Reflect on your goals and what you want to accomplish"
    ]
  };
  
  const moodTips = tips[mood] || tips.neutral;
  return getRandomItem(moodTips);
};

// Emergency resources
export const getEmergencyResources = () => {
  return {
    crisis: {
      title: "Crisis Hotlines",
      resources: [
        { name: "National Suicide Prevention Lifeline", number: "988", available: "24/7" },
        { name: "Crisis Text Line", number: "Text HOME to 741741", available: "24/7" },
        { name: "SAMHSA National Helpline", number: "1-800-662-4357", available: "24/7" }
      ]
    },
    support: {
      title: "Support Resources",
      resources: [
        { name: "NAMI (National Alliance on Mental Illness)", website: "nami.org" },
        { name: "Mental Health America", website: "mhanational.org" },
        { name: "Psychology Today Therapist Finder", website: "psychologytoday.com" }
      ]
    }
  };
};