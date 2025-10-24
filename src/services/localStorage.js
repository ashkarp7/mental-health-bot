// services/localStorage.js

// --- New Default User Definitions ---
export const DEFAULT_USER_EMAIL = 'default_anon@mindfulchat.ai';

export const getDefaultUser = () => {
  return { 
    name: 'Guest', 
    email: DEFAULT_USER_EMAIL 
  };
};

// --- User session management ---
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('mindfulbot_user');
    return user ? JSON.parse(user) : getDefaultUser();
  } catch (error) {
    // REMOVED: console.error('Error getting current user:', error);
    return getDefaultUser();
  }
};

export const saveUser = (userData) => {
  try {
    localStorage.setItem('mindfulbot_user', JSON.stringify(userData));
  } catch (error) {
    // REMOVED: console.error('Error saving user:', error);
  }
};

export const logoutUser = () => {
  try {
    localStorage.removeItem('mindfulbot_user');
  } catch (error) {
    // REMOVED: console.error('Error during logout:', error);
  }
};

// --- User-specific message management ---
export const getUserMessages = (email) => {
  try {
    if (!email) return [];
    const messages = localStorage.getItem(`messages_${email}`);
    return messages ? JSON.parse(messages) : [];
  } catch (error) {
    // REMOVED: console.error('Error getting user messages:', error);
    return [];
  }
};

export const saveUserMessages = (email, messages) => {
  try {
    if (!email || !messages) return;
    localStorage.setItem(`messages_${email}`, JSON.stringify(messages));
  } catch (error) {
    // REMOVED: console.error('Error saving user messages:', error);
  }
};

export const clearUserMessages = (email) => {
  try {
    if (!email) return;
    localStorage.removeItem(`messages_${email}`);
  } catch (error) {
    // REMOVED: console.error('Error clearing user messages:', error);
  }
};

// --- Mood history management ---
export const getMoodHistory = (email) => {
  try {
    if (!email) return [];
    const history = localStorage.getItem(`mood_history_${email}`);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    // REMOVED: console.error('Error getting mood history:', error);
    return [];
  }
};

export const saveMoodHistory = (email, moodHistory) => {
  try {
    if (!email || !moodHistory) return;
    localStorage.setItem(`mood_history_${email}`, JSON.stringify(moodHistory));
  } catch (error) {
    // REMOVED: console.error('Error saving mood history:', error);
  }
};

export const addMoodEntry = (email, moodEntry) => {
  try {
    if (!email || !moodEntry) return;
    const existingHistory = getMoodHistory(email);
    const updatedHistory = [...existingHistory, moodEntry];
    saveMoodHistory(email, updatedHistory);
  } catch (error) {
    // REMOVED: console.error('Error adding mood entry:', error);
  }
};

// --- Session management ---
export const createNewChatSession = (email) => {
  try {
    if (!email) return null;
    const sessionId = `session_${Date.now()}`;
    const sessions = getUserChatSessions(email);
    const newSession = {
      id: sessionId,
      title: `Chat ${sessions.length + 1}`,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      messageCount: 0
    };
    
    sessions.push(newSession);
    localStorage.setItem(`chat_sessions_${email}`, JSON.stringify(sessions));
    return newSession;
  } catch (error) {
    // REMOVED: console.error('Error creating new chat session:', error);
    return null;
  }
};

export const getUserChatSessions = (email) => {
  try {
    if (!email) return [];
    const sessions = localStorage.getItem(`chat_sessions_${email}`);
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    // REMOVED: console.error('Error getting user chat sessions:', error);
    return [];
  }
};

export const updateChatSession = (email, sessionId, updates) => {
  try {
    if (!email || !sessionId) return;
    const sessions = getUserChatSessions(email);
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex !== -1) {
      sessions[sessionIndex] = { ...sessions[sessionIndex], ...updates };
      localStorage.setItem(`chat_sessions_${email}`, JSON.stringify(sessions));
    }
  } catch (error) {
    // REMOVED: console.error('Error updating chat session:', error);
  }
};

// --- Cleanup functions ---
export const clearAllUserData = (email) => {
  try {
    if (!email) return;
    localStorage.removeItem(`mood_history_${email}`);
    localStorage.removeItem(`messages_${email}`);
    localStorage.removeItem(`user_join_date_${email}`);
    localStorage.removeItem(`chat_sessions_${email}`);
  } catch (error) {
    // REMOVED: console.error('Error clearing user data:', error);
  }
};

// --- Migration function ---
export const migrateGlobalMessagesToUser = (email) => {
  try {
    if (!email) return;
    
    const existingMessages = getUserMessages(email);
    if (existingMessages.length > 0) return;
    
    const globalMessages = localStorage.getItem('mindfulbot_messages');
    if (globalMessages) {
      const messages = JSON.parse(globalMessages);
      if (messages.length > 0) {
        saveUserMessages(email, messages);
        // REMOVED: console.log(`Migrated ${messages.length} messages for user: ${email}`);
      }
    }
  } catch (error) {
    // REMOVED: console.error('Error migrating messages:', error);
  }
};
