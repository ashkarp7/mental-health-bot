import React from 'react';

// Added onMoodReset prop
const Header = ({ user, onLogout, onToggleSidebar, currentMood, onMoodReset }) => {
  return (
    <header className="fixed w-full top-0 bg-white shadow-md border-b border-gray-200 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            {/* Sidebar Toggle Button for Mobile/Desktop */}
            <button
              onClick={onToggleSidebar}
              className="p-2 mr-2 text-gray-600 hover:text-indigo-600 transition-colors md:hidden"
              title="Toggle Wellness Panel"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            
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
            {/* Current Mood Display (with Change Button) */}
            {currentMood ? (
              <div className="hidden sm:flex items-center space-x-2 bg-gray-50 rounded-full pr-1">
                <span className="text-lg pl-3 py-1">{currentMood.emoji}</span>
                <span className="text-sm text-gray-600">Feeling {currentMood.name}</span>
                <button
                  onClick={onMoodReset} // ✅ Reset mood when clicked
                  className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs hover:bg-indigo-100 transition duration-200"
                  title="Change your current mood"
                >
                  Change
                </button>
              </div>
            ) : (
              // Show a small prompt to set the mood if one hasn't been set, but only after the initial selection has been made
              // This is a subtle prompt to re-engage the user if they've already set it once
              <div className="hidden sm:flex items-center space-x-2">
                <button
                  onClick={onMoodReset}
                  className="px-3 py-1 text-sm bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition duration-200"
                >
                  Set Mood
                </button>
              </div>
            )}

            {/* User Profile */}
            {user && (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-800">
                    Welcome, {user.name}!
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
            
            {/* Sidebar Toggle Button for Desktop */}
            <button
              onClick={onToggleSidebar}
              className="p-2 text-gray-600 hover:text-indigo-600 transition-colors hidden md:block"
              title="Toggle Wellness Panel"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Mood Display */}
      {currentMood && (
        <div className="sm:hidden bg-gray-50 px-4 py-2 border-t border-gray-100">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-lg">{currentMood.emoji}</span>
            <span className="text-sm text-gray-600">Currently feeling {currentMood.name}</span>
            <button
              onClick={onMoodReset} // ✅ Reset mood when clicked
              className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs hover:bg-indigo-100 transition duration-200"
              title="Change your current mood"
            >
              Change
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
