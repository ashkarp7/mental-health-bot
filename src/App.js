import React, { useState, useEffect } from 'react';
import './App.css';
import ChatInterface from './components/Chat/ChatInterface';
import Header from './components/UI/Header';
import Sidebar from './components/UI/Sidebar';
import MoodSelector from './components/Wellness/MoodSelector';
import BreathingExercise from './components/Wellness/BreathingExercise';
import {
  getCurrentUser,
  logoutUser,
  getDefaultUser 
} from './services/localStorage';

function App() {
  const [user, setUser] = useState(null);
  const [currentMood, setCurrentMood] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  // REMOVED: isMoodSelectionVisible state
  
  // Initialize Guest user
  useEffect(() => {
    const storedUser = getCurrentUser();
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    logoutUser();
    
    setUser(getDefaultUser());
    setCurrentMood(null);
    setIsSidebarOpen(false);
    setShowBreathingExercise(false);
    // Setting currentMood to null ensures the selector reappears on logout
    
    alert("Logged out of existing session. You are now logged in as 'Guest'.");
  };

  const handleMoodSelect = (mood) => {
    // 1. Set the mood
    setCurrentMood(mood); 
    // 2. The component will now automatically hide because currentMood is no longer null.
    
    if (!user?.email) return;
    
    const moodEntry = {
      mood: mood.name,
      timestamp: new Date().toISOString(),
      emoji: mood.emoji
    };
    
    const existingHistory = JSON.parse(localStorage.getItem(`mood_history_${user.email}`) || '[]');
    existingHistory.push(moodEntry);
    localStorage.setItem(`mood_history_${user.email}`, JSON.stringify(existingHistory));
  };
  
  const handleMoodReset = () => {
    // 1. Set mood to null
    setCurrentMood(null);
    // 2. This single action is enough to make the selector visible again.
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const startBreathingExercise = () => {
    setShowBreathingExercise(true);
  };

  const closeBreathingExercise = () => {
    setShowBreathingExercise(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <>
        <Header 
          user={user} 
          onLogout={handleLogout}
          onToggleSidebar={toggleSidebar} 
          onStartBreathing={startBreathingExercise}
          currentMood={currentMood}
          onMoodReset={handleMoodReset} 
        />
        
        {/* Full-screen overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" 
            onClick={toggleSidebar}
          ></div>
        )}
        
        <div className="flex h-screen pt-16">
          <Sidebar 
            user={user}
            isOpen={isSidebarOpen}
            onToggle={toggleSidebar}
          />
          
          {/* Main content area */}
          <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-0 md:mr-80' : 'ml-0 mr-0'}`}>
            
            {/* ✅ FINAL SIMPLIFIED LOGIC: Show Mood Selector ONLY if currentMood is null */}
            {!currentMood && (
              <div className="bg-white border-b border-gray-200 p-4">
                <MoodSelector onMoodSelect={handleMoodSelect} />
              </div>
            )}
            
            <div className="flex-1 overflow-hidden">
              <ChatInterface 
                user={user} 
                currentMood={currentMood}
                onMoodChange={setCurrentMood}
              />
            </div>
          </div>
        </div>
        
        {showBreathingExercise && (
          <BreathingExercise isOpen={showBreathingExercise} onClose={closeBreathingExercise} />
        )}
      </>
    </div>
  );
}

export default App;
