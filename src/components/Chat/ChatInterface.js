import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import ClearChatModal from './ClearChatModal';
import { callLLMAPI } from '../../services/llmApi';
import { 
  getUserMessages, 
  saveUserMessages, 
  addMoodEntry,
  migrateGlobalMessagesToUser 
} from '../../services/localStorage';

const ChatInterface = ({ user, currentMood }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const messagesEndRef = useRef(null);

  // ✅ FIXED: Load user-specific messages
  useEffect(() => {
    if (!user?.email) return;

    // Migrate old global messages if needed
    migrateGlobalMessagesToUser(user.email);
    
    // Load user-specific messages
    const userMessages = getUserMessages(user.email);
    
    if (userMessages && userMessages.length > 0) {
      setMessages(userMessages);
    } else {
      // Create welcome message for new user
      const welcomeMessage = {
        id: `welcome_${Date.now()}`,
        text: `Hello ${user?.name || 'there'}! I'm MindfulBot, your empathetic AI companion. I'm here to listen and support you through whatever you're experiencing. How are you feeling today? Feel free to share what's on your mind - there's no judgment here, just understanding and care.`,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      // Save welcome message immediately
      saveUserMessages(user.email, [welcomeMessage]);
    }
  }, [user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ NEW: Keyboard shortcut for clear chat (Ctrl+Shift+C)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        if (messages.length > 1) {
          handleClearChat();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [messages.length]);

  // ✅ FIXED: Save messages to user-specific storage
  useEffect(() => {
    if (user?.email && messages.length > 0) {
      saveUserMessages(user.email, messages);
    }
  }, [messages, user?.email]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading || !user?.email) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
      mood: currentMood
    };

    // Add user message to state
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Pass conversation history to API for better context
      const conversationHistory = messages.slice(-10); // Last 10 messages for context
      const botResponse = await callLLMAPI(messageText, currentMood, conversationHistory);
      
      const botMessage = {
        id: `bot_${Date.now()}`,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };

      // Add bot message to state
      setMessages(prev => [...prev, botMessage]);
      
      // ✅ FIXED: Save mood entry with proper user association
      if (user?.email && currentMood) {
        const moodData = currentMood && typeof currentMood === 'object' 
          ? { name: currentMood.name, emoji: currentMood.emoji }
          : currentMood;

        const moodEntry = {
          mood: moodData,
          timestamp: new Date().toISOString(),
          message: messageText.substring(0, 100) // First 100 chars for reference
        };

        addMoodEntry(user.email, moodEntry);
      }
      
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: `error_${Date.now()}`,
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment. Remember, if you're in crisis, please reach out to a mental health professional or crisis hotline immediately.",
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ ENHANCED: Advanced clear chat function with options
  const handleClearChat = () => {
    if (!user?.email || messages.length <= 1) return;
    setShowClearModal(true);
  };

  const handleConfirmClear = (options) => {
    if (!user?.email) return;

    let messagesToKeep = [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (options.option) {
      case 'all':
        messagesToKeep = [];
        break;
      case 'recent':
        messagesToKeep = messages.slice(0, 5);
        break;
      case 'today':
        messagesToKeep = messages.filter(msg => {
          const msgDate = new Date(msg.timestamp);
          return msgDate < today;
        });
        break;
      default:
        messagesToKeep = [];
    }

    // Add welcome message if requested
    if (options.keepWelcome) {
      const welcomeMessage = {
        id: `welcome_${Date.now()}`,
        text: `Hello again ${user?.name || 'there'}! 👋 I'm here and ready to support you. How are you feeling today?`,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      messagesToKeep.push(welcomeMessage);
    }

    setMessages(messagesToKeep);
    saveUserMessages(user.email, messagesToKeep);

    // Show success feedback
    setTimeout(() => {
      const successMessage = {
        id: `system_${Date.now()}`,
        text: `✨ Chat cleared! I'm here to continue supporting you on your journey.`,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isSystem: true
      };
      setMessages(prev => [...prev, successMessage]);
    }, 500);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg h-[600px] flex flex-col relative">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">MindfulBot</h3>
              <p className="text-sm text-green-600 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Online & Ready to Help
              </p>
            </div>
          </div>
          
          {/* ✅ ENHANCED: Chat actions with better UI */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-xs text-gray-500">
                {messages.length > 1 ? `${messages.length - 1} messages` : 'New chat'}
              </p>
              {currentMood && (
                <p className="text-xs text-indigo-600 flex items-center justify-end">
                  <span className="mr-1">{currentMood.emoji}</span>
                  {currentMood.name}
                </p>
              )}
            </div>
            
            {messages.length > 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleClearChat}
                  className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors border border-red-200 flex items-center space-x-1"
                  title="Clear messages with options"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Clear</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-4 rounded-2xl max-w-xs">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">MindfulBot is typing...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
      
      {/* ✅ NEW: Floating Clear Button (appears when scrolled up) */}
      {messages.length > 5 && (
        <div className="absolute bottom-20 right-4">
          <button
            onClick={handleClearChat}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="Clear Chat (Ctrl+Shift+C)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}

      {/* ✅ NEW: Advanced Clear Chat Modal */}
      <ClearChatModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleConfirmClear}
        messageCount={messages.length - 1}
        user={user}
      />
    </div>
  );
};

export default ChatInterface;