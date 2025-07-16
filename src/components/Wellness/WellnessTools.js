import React, { useState } from 'react';
import BreathingExercise from './BreathingExercise';

const WellnessTools = () => {
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [showCrisisResources, setShowCrisisResources] = useState(false);

  const wellnessActivities = [
    {
      id: 1,
      title: 'Breathing Exercise',
      description: 'Guided 4-7-8 breathing to reduce anxiety',
      icon: '🫁',
      action: () => setShowBreathingExercise(true),
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      id: 2,
      title: 'Gratitude Practice',
      description: 'List 3 things you\'re grateful for today',
      icon: '🙏',
      action: () => alert('Feature coming soon! Try writing in a journal for now.'),
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    {
      id: 3,
      title: 'Quick Meditation',
      description: '5-minute mindfulness session',
      icon: '🧘‍♀️',
      action: () => alert('Feature coming soon! Try a meditation app like Headspace.'),
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    },
    {
      id: 4,
      title: 'Mood Journal',
      description: 'Track your emotions and triggers',
      icon: '📝',
      action: () => alert('Feature coming soon! Keep a simple diary for now.'),
      color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
    }
  ];

  const crisisResources = [
    {
      name: 'National Suicide Prevention Lifeline',
      phone: '988',
      description: '24/7 free and confidential support',
      urgent: true
    },
    {
      name: 'Crisis Text Line',
      phone: 'Text HOME to 741741',
      description: 'Free, 24/7 crisis support via text',
      urgent: true
    },
    {
      name: 'National Domestic Violence Hotline',
      phone: '1-800-799-7233',
      description: '24/7 support for domestic violence',
      urgent: false
    },
    {
      name: 'SAMHSA Helpline',
      phone: '1-800-662-4357',
      description: 'Mental health and substance abuse',
      urgent: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Wellness Activities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🌟 Wellness Tools</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wellnessActivities.map((activity) => (
            <button
              key={activity.id}
              onClick={activity.action}
              className={`p-4 rounded-lg border-2 text-left transition duration-200 hover:scale-105 ${activity.color}`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{activity.icon}</div>
                <div>
                  <h4 className="font-medium text-gray-800">{activity.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Crisis Resources */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">🆘 Crisis Support</h3>
          <button
            onClick={() => setShowCrisisResources(!showCrisisResources)}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            {showCrisisResources ? 'Hide' : 'Show'} Resources
          </button>
        </div>

        {showCrisisResources && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              If you're having thoughts of suicide or self-harm, please reach out for help immediately.
            </p>
            
            {crisisResources.map((resource, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  resource.urgent 
                    ? 'border-red-200 bg-red-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">{resource.name}</h4>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                  </div>
                  <a
                    href={`tel:${resource.phone.replace(/[^\d]/g, '')}`}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      resource.urgent
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    } transition duration-200`}
                  >
                    {resource.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {!showCrisisResources && (
          <p className="text-sm text-gray-600">
            Emergency resources available - click "Show Resources" above
          </p>
        )}
      </div>

      {/* Daily Tips */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Daily Wellness Tip</h3>
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4">
          <p className="text-gray-700">
            <strong>Today's tip:</strong> Take a 5-minute break every hour to stretch, breathe deeply, 
            or step outside. Small moments of self-care throughout the day can significantly improve 
            your mental wellbeing.
          </p>
        </div>
      </div>

      {/* Breathing Exercise Modal */}
      <BreathingExercise
        isOpen={showBreathingExercise}
        onClose={() => setShowBreathingExercise(false)}
      />
    </div>
  );
};

export default WellnessTools;