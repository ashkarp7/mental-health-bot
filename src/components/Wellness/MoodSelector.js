import React, { useState } from 'react';
import { moods } from '../../utils/constants';

const MoodSelector = ({ onMoodSelect, selectedMood }) => {
  const [hoveredMood, setHoveredMood] = useState(null);

  const handleMoodClick = (moodKey, moodData) => {
    if (onMoodSelect) {
      onMoodSelect(moodKey, moodData);
    }
  };

  return (
    <div className="mood-selector">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">How are you feeling?</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {Object.entries(moods).map(([moodKey, mood]) => (
          <button
            key={moodKey}
            onClick={() => handleMoodClick(moodKey, mood)}
            onMouseEnter={() => setHoveredMood(moodKey)}
            onMouseLeave={() => setHoveredMood(null)}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500
              ${mood.color} ${mood.borderColor}
              ${selectedMood === moodKey ? 'ring-2 ring-purple-500 scale-105' : ''}
              ${hoveredMood === moodKey ? 'shadow-lg' : 'shadow-sm'}
            `}
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-sm font-medium">{mood.name}</span>
              {(hoveredMood === moodKey || selectedMood === moodKey) && (
                <p className="text-xs text-center opacity-75">
                  {mood.description}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;