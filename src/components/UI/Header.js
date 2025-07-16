import React from 'react';

const Header = ({ user, onLogout, currentMood }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🤗</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">MindChat</h1>
              <p className="text-xs text-gray-500">Your AI Mental Health Companion</p>
            </div>
          </div>

          {/* User Info and Controls */}
          <div className="flex items-center space-x-4">
            {/* Current Mood Display */}
            {currentMood && (
              <div className="hidden sm:flex items-center space-x-2 bg-gray-50 rounded-full px-3 py-1">
                <span className="text-lg">{currentMood.emoji}</span>
                <span className="text-sm text-gray-600">Feeling {currentMood.label}</span>
              </div>
            )}

            {/* User Profile */}
            {user && (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-800">
                    Welcome back, {user.name}!
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {/* User Avatar */}
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-medium text-sm">
                    {typeof user.name === 'string' ? user.name.charAt(0).toUpperCase() : '?'}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium transition duration-200"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Mood Display */}
      {currentMood && (
        <div className="sm:hidden bg-gray-50 px-4 py-2 border-t border-gray-100">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-lg">{currentMood.emoji}</span>
            <span className="text-sm text-gray-600">Currently feeling {currentMood.label}</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
