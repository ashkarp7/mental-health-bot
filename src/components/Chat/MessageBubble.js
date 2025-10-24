import React from 'react';
import { moods } from '../../utils/constants';

const MessageBubble = ({ message }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodEmoji = (moodInput) => {
    // 1. Check if moodInput is already an object (e.g., passed as {name, emoji})
    if (typeof moodInput === 'object' && moodInput?.name) {
        // Find the mood key by name (e.g., 'Happy' -> 'happy')
        const moodKey = moodInput.name.toLowerCase();
        return moods[moodKey]?.emoji || moodInput.emoji || moods.neutral.emoji;
    }

    // 2. Assume moodInput is the key string (e.g., 'happy', 'sad')
    const moodKey = typeof moodInput === 'string' ? moodInput.toLowerCase() : null;
    
    // Direct lookup using the object key (more efficient)
    const mood = moods[moodKey];

    // Fallback logic
    if (mood) {
        return mood.emoji;
    }
    
    return moods.neutral.emoji; // Default to neutral if nothing is found
  };

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
        {/* Avatar */}
        <div className={`flex items-end space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-content text-sm ${
              message.sender === 'user'
                ? 'bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {message.sender === 'user' ? '👤' : '🤖'}
          </div>

          {/* Message Content - FIXED FOR BETTER VISIBILITY */}
          <div
            className={`p-4 rounded-2xl ${
              message.sender === 'user'
                ? 'bg-blue-700 text-white rounded-br-sm shadow-md'
                : 'bg-gray-100 text-gray-800 rounded-bl-sm border border-gray-200'
            }`}
            style={message.sender === 'user' ? {
              background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
              color: '#ffffff',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              fontWeight: '500'
            } : {}}
          >
            <p className="whitespace-pre-wrap leading-relaxed" 
               style={message.sender === 'user' ? { 
                 color: '#ffffff',
                 fontWeight: '500' 
               } : {}}>
              {message.text}
            </p>

            {/* Message Footer */}
            <div
              className={`flex items-center justify-between mt-2 text-xs ${
                message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}
              style={message.sender === 'user' ? { 
                color: '#dbeafe',
                fontWeight: '400' 
              } : {}}
            >
              <span>{formatTime(message.timestamp)}</span>

              {/* Mood indicator for user messages */}
              {message.mood && message.sender === 'user' && (
                <span className="ml-2 flex items-center" 
                      style={{ color: '#dbeafe' }}>
                  <span className="mr-1">{getMoodEmoji(message.mood)}</span>
                  <span className="capitalize">
                    {typeof message.mood === 'string'
                      ? message.mood
                      : message.mood?.name || 'unknown'}
                  </span>
                </span>
              )}

              {/* Message status for user messages */}
              {message.sender === 'user' && 
                <span className="ml-2" style={{ color: '#dbeafe' }}>✓</span>
              }
            </div>
          </div>
        </div>

        {/* Helpful suggestions for bot messages */}
        {message.sender === 'bot' && message.text.includes('💡') && (
          <div className="mt-2 ml-10">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
              <div className="flex items-start">
                <span className="text-blue-400 mr-2">💡</span>
                <p className="text-sm text-blue-800">
                  This is a helpful tip based on your current mood and situation.
                </p>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default MessageBubble;
