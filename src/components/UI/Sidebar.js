import React, { useState, useEffect } from 'react';
import { getCurrentUser, logoutUser, getMoodHistory } from '../../services/localStorage';

const Sidebar = ({ user, isOpen, onToggle }) => {
  const [moodHistory, setMoodHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('mood');

  useEffect(() => {
    if (user) {
      const history = getMoodHistory(user.email);
      setMoodHistory(history.slice(-7)); // Last 7 entries
    }
  }, [user]);

  const getWellnessTips = () => [
    "Take 3 deep breaths when feeling overwhelmed",
    "Practice gratitude by naming 3 good things daily",
    "Take short breaks every hour while working",
    "Stay hydrated - aim for 8 glasses of water",
    "Get 7-9 hours of sleep each night",
    "Connect with friends or family regularly",
    "Spend time in nature when possible",
    "Limit social media if it affects your mood"
  ];

  const getChatStats = () => {
    const totalMessages = localStorage.getItem(`messages_${user?.email}`) 
      ? JSON.parse(localStorage.getItem(`messages_${user.email}`)).length 
      : 0;

    const joinDate = localStorage.getItem(`user_join_date_${user?.email}`) || new Date().toISOString();
    const daysActive = Math.ceil((new Date() - new Date(joinDate)) / (1000 * 60 * 60 * 24));

    return {
      totalMessages: Math.floor(totalMessages / 2), // Divide by 2 to get user messages only
      daysActive: Math.max(1, daysActive),
      lastActive: 'Today'
    };
  };

  const stats = user ? getChatStats() : null;
  const wellnessTips = getWellnessTips();
  const randomTip = wellnessTips[Math.floor(Math.random() * wellnessTips.length)];

  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <h2 className="text-lg font-semibold">Wellness Panel</h2>
        <button
          onClick={onToggle}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {['mood', 'stats', 'tips'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'mood' ? 'Mood History' : tab === 'stats' ? 'Statistics' : 'Tips'}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'mood' && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Moods</h3>
            {moodHistory.length > 0 ? (
              <div className="space-y-3">
                {moodHistory.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{entry.emoji || '😊'}</span>
                      <div>
                        <p className="font-medium text-gray-800">
                          {/* Fixed: Properly handle mood object */}
                          {typeof entry.mood === 'string' 
                            ? entry.mood 
                            : (entry.mood && typeof entry.mood === 'object' && entry.mood.name)
                              ? entry.mood.name 
                              : 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-4">📊</div>
                <p>No mood history yet.</p>
                <p className="text-sm">Start chatting to track your moods!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && stats && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Your Progress</h3>
            <div className="space-y-4">
              {[
                { label: 'Messages Sent', value: stats.totalMessages, icon: '💬', color: 'blue' },
                { label: 'Days Active', value: stats.daysActive, icon: '📅', color: 'green' },
                { label: 'Last Active', value: stats.lastActive, icon: '⏰', color: 'purple' },
                { label: 'Wellness Score', value: 'Great! 🌟', icon: '💝', color: 'pink' }
              ].map(({ label, value, icon, color }) => (
                <div key={label} className={`bg-gradient-to-r from-${color}-50 to-${color}-100 p-4 rounded-lg`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm text-${color}-600 font-medium`}>{label}</p>
                      <p className={`text-2xl font-bold text-${color}-800`}>{value}</p>
                    </div>
                    <div className="text-3xl">{icon}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Wellness Tips</h3>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg mb-6 border border-yellow-200">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">💡</div>
                <div>
                  <h4 className="font-semibold text-orange-800 mb-2">Tip of the Day</h4>
                  <p className="text-orange-700 text-sm leading-relaxed">{randomTip}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {wellnessTips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-lg">✨</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                <span className="text-xl mr-2">🆘</span>
                Crisis Resources
              </h4>
              <div className="space-y-2 text-sm">
                <p className="text-red-700">
                  <strong>National Suicide Prevention Lifeline:</strong><br />
                  <a href="tel:988" className="text-red-600 hover:underline">988</a>
                </p>
                <p className="text-red-700">
                  <strong>Crisis Text Line:</strong><br />
                  Text HOME to <a href="sms:741741" className="text-red-600 hover:underline">741741</a>
                </p>
                <p className="text-red-700">
                  <strong>Emergency:</strong><br />
                  <a href="tel:911" className="text-red-600 hover:underline">911</a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ✅ FIXED: Added missing export default
export default Sidebar;