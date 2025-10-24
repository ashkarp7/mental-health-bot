import React, { useState } from 'react';
// Voice imports removed

const InputArea = ({ onSendMessage, isLoading }) => {
  const [inputMessage, setInputMessage] = useState('');
  // All voice-related states and refs removed

  // Handle Send logic (simplified)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      
      onSendMessage(inputMessage);
      
      // FIXED: Delay clearing the input field slightly
      setTimeout(() => {
        setInputMessage('');
      }, 50); 
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };


  const handleQuickResponse = (response) => {
    if (!isLoading) {
      setInputMessage(response);
      // Auto-focus on textarea after selecting quick response
      setTimeout(() => {
        const textarea = document.querySelector('textarea');
        if (textarea) {
          textarea.focus();
          textarea.setSelectionRange(response.length, response.length);
        }
      }, 100);
    }
  };

  const quickResponses = [
    "I'm feeling stressed",
    "I need motivation",
    "I'm having trouble sleeping",
    "I feel anxious",
    "I'm feeling lonely",
    "I need help coping",
    "I'm overwhelmed" 
  ];

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      {/* Quick Response Buttons */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-2">
          {quickResponses.map((response, index) => (
            <button
              key={index}
              onClick={() => handleQuickResponse(response)}
              disabled={isLoading}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {response}
            </button>
          ))}
        </div>
      </div>

      {/* REMOVED: All Voice/Recording Status JSX */}
      
      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="flex space-x-3">
        {/* Text Input (Now full width) */}
        <div className="flex-1 relative">
          <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Share what's on your mind... I'm here to listen."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition duration-200 text-gray-700 bg-white"
          style={{
            minHeight: '42px',
            maxHeight: '120px',
            overflowY: inputMessage.length > 100 ? 'auto' : 'hidden',
            color: '#374151 !important' // Force dark text
          }}
          disabled={isLoading}
          maxLength={1000}
          />
          
          {/* Character Counter */}
          {inputMessage.length > 0 && (
            <div className="absolute bottom-1 right-2 text-xs text-gray-400">
              {inputMessage.length}/1000
            </div>
          )}
        </div>
        
        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>Send</span>
              <span>↗</span>
            </>
          )}
        </button>
      </form>
      
    </div>
  );
};

export default InputArea;
