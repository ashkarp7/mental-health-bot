import React, { useState } from 'react';

const ClearChatModal = ({ isOpen, onClose, onConfirm, messageCount, user }) => {
  const [clearOption, setClearOption] = useState('all');
  const [keepWelcomeMessage, setKeepWelcomeMessage] = useState(true);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm({
      option: clearOption,
      keepWelcome: keepWelcomeMessage
    });
    onClose();
  };

  const clearOptions = [
    {
      value: 'all',
      label: 'Clear All Messages',
      description: 'Delete entire conversation history'
    },
    {
      value: 'recent',
      label: 'Clear Recent Messages',
      description: 'Keep first 5 messages, clear the rest'
    },
    {
      value: 'today',
      label: 'Clear Today\'s Messages',
      description: 'Keep messages from previous days'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Clear Chat History</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Message Count and Warning */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">
              You have <span className="font-semibold text-indigo-600">{messageCount}</span> messages in your chat history.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-800">Warning</p>
                  <p className="text-sm text-amber-700">This action cannot be undone. Your mood history will be preserved.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Clear Options */}
          <div className="space-y-3 mb-4">
            <p className="text-sm font-medium text-gray-900 mb-2">Choose what to clear:</p>
            {clearOptions.map((option) => (
              <label key={option.value} className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="radio"
                  name="clearOption"
                  value={option.value}
                  checked={clearOption === option.value}
                  onChange={(e) => setClearOption(e.target.value)}
                  className="mt-1 text-red-600 focus:ring-red-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 group-hover:text-gray-700">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </label>
            ))}
          </div>

          {/* Additional Options */}
          <div className="border-t border-gray-200 pt-4">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={keepWelcomeMessage}
                onChange={(e) => setKeepWelcomeMessage(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-600">Keep welcome message</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end space-x-3 mb-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Clear Messages
            </button>
          </div>

          {/* Keyboard Shortcut Hint */}
          <div className="text-center">
            <p className="text-xs text-gray-400">
              💡 Tip: Use <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 rounded border border-gray-300">Ctrl+Shift+C</kbd> for quick clear
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClearChatModal;