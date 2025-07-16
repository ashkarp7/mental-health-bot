import React, { useState, useEffect } from 'react';

const BreathingExercise = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale'); // 'inhale', 'hold', 'exhale'
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [totalCycles, setTotalCycles] = useState(5);

  useEffect(() => {
    let interval;
    
    if (isActive) {
      interval = setInterval(() => {
        setCount(prev => {
          if (prev === 1) {
            // Move to next phase
            if (phase === 'inhale') {
              setPhase('hold');
              return 4;
            } else if (phase === 'hold') {
              setPhase('exhale');
              return 4;
            } else {
              setPhase('inhale');
              setCycle(c => c + 1);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phase]);

  useEffect(() => {
    if (cycle >= totalCycles && isActive) {
      setIsActive(false);
      setPhase('inhale');
      setCount(4);
      setCycle(0);
    }
  }, [cycle, totalCycles, isActive]);

  const startExercise = () => {
    setIsActive(true);
    setCount(4);
    setPhase('inhale');
    setCycle(0);
  };

  const stopExercise = () => {
    setIsActive(false);
    setPhase('inhale');
    setCount(4);
    setCycle(0);
  };

  const getPhaseInstructions = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe in slowly through your nose';
      case 'hold':
        return 'Hold your breath gently';
      case 'exhale':
        return 'Breathe out slowly through your mouth';
      default:
        return 'Prepare to begin';
    }
  };

  const getCircleSize = () => {
    switch (phase) {
      case 'inhale':
        return 'scale-110';
      case 'hold':
        return 'scale-110';
      case 'exhale':
        return 'scale-75';
      default:
        return 'scale-100';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Breathing Exercise</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="text-center">
          {/* Breathing Circle */}
          <div className="relative flex items-center justify-center mb-6">
            <div
              className={`w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center transition-transform duration-1000 ${getCircleSize()}`}
            >
              <div className="text-white font-bold text-2xl">{count}</div>
            </div>
          </div>

          {/* Instructions */}
          <p className="text-lg text-gray-700 mb-2 font-medium">
            {getPhaseInstructions()}
          </p>
          
          <p className="text-sm text-gray-500 mb-6">
            {isActive ? `Cycle ${cycle + 1} of ${totalCycles}` : 'Ready to begin'}
          </p>

          {/* Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            {!isActive ? (
              <button
                onClick={startExercise}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                Start Exercise
              </button>
            ) : (
              <button
                onClick={stopExercise}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
              >
                Stop Exercise
              </button>
            )}
          </div>

          {/* Cycle Settings */}
          {!isActive && (
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">
                Number of cycles:
              </label>
              <select
                value={totalCycles}
                onChange={(e) => setTotalCycles(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-md"
              >
                <option value={3}>3 cycles</option>
                <option value={5}>5 cycles</option>
                <option value={10}>10 cycles</option>
              </select>
            </div>
          )}

          {/* Tips */}
          <div className="text-left bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">💡 Tips:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Find a comfortable position</li>
              <li>• Focus on the breathing rhythm</li>
              <li>• Let your thoughts pass by naturally</li>
              <li>• Practice regularly for best results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;