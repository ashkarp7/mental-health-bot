import React, { useState, useEffect } from 'react';
import './App.css';
import LoginForm from './components/Auth/LoginForm';
import SignUpForm from './components/Auth/SignUpForm';
import ChatInterface from './components/Chat/ChatInterface';
import Header from './components/UI/Header';
import Sidebar from './components/UI/Sidebar';
import MoodSelector from './components/Wellness/MoodSelector';
import BreathingExercise from './components/Wellness/BreathingExercise';
import {
  getCurrentUser,
  saveUser,
  logoutUser,
  clearAllUserData  // ✅ NEW: Import for data cleanup
} from './services/localStorage';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login'); // 'login', 'signup', 'chat'
  const [currentMood, setCurrentMood] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on app load
  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      setCurrentView('chat');
    }
    setIsLoading(false);
  }, []);

  // ✅ FIXED: Handle user login with proper validation
  const handleLogin = async (email, password) => {
    try {
      // ✅ ENHANCED: Better validation
      if (!email?.trim() || !password?.trim()) {
        return { success: false, error: 'Please enter both email and password' };
      }

      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = existingUsers.find(u => 
        u.email?.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (foundUser) {
        const userData = { email: foundUser.email, name: foundUser.name };
        setUser(userData);
        saveUser(userData);
        setCurrentView('chat');
        
        console.log('✅ Login successful for:', userData.email);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  // ✅ FIXED: Handle user signup with proper validation
  const handleSignUp = async (name, email, password) => {
    try {
      // ✅ ENHANCED: Better validation
      if (!name?.trim() || !email?.trim() || !password?.trim()) {
        return { success: false, error: 'Please fill in all fields' };
      }

      if (name.trim().length < 2) {
        return { success: false, error: 'Name must be at least 2 characters' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      if (!email.includes('@') || !email.includes('.')) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = existingUsers.find(u => 
        u.email?.toLowerCase() === email.toLowerCase()
      );
      
      if (userExists) {
        return { success: false, error: 'User with this email already exists' };
      }

      const newUser = { 
        name: name.trim(), 
        email: email.toLowerCase().trim(), 
        password, 
        joinDate: new Date().toISOString() 
      };
      
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      localStorage.setItem(`user_join_date_${newUser.email}`, new Date().toISOString());
      
      const userData = { email: newUser.email, name: newUser.name };
      setUser(userData);
      saveUser(userData);
      setCurrentView('chat');
      
      console.log('✅ Signup successful for:', userData.email);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Signup failed. Please try again.' };
    }
  };

  // ✅ ENHANCED: Handle user logout with proper cleanup
  const handleLogout = () => {
    console.log('🔓 Logging out user:', user?.email);
    
    // Clear all state
    setUser(null);
    setCurrentMood(null);
    setCurrentView('login');
    setIsSidebarOpen(false);
    setShowBreathingExercise(false);
    
    // Clear localStorage session
    logoutUser();
    
    // ✅ OPTIONAL: Uncomment to clear all user data on logout
    // if (user?.email) {
    //   clearAllUserData(user.email);
    // }
  };

  // Handle mood selection
  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);
    
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const startBreathingExercise = () => {
    setShowBreathingExercise(true);
  };

  const closeBreathingExercise = () => {
    setShowBreathingExercise(false);
  };

  const toggleAuthView = () => {
    setCurrentView(currentView === 'login' ? 'signup' : 'login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {user ? (
        <>
          <Header 
            user={user} 
            onLogout={handleLogout}
            onToggleSidebar={toggleSidebar}
            onStartBreathing={startBreathingExercise}
          />
          
          <div className="flex h-screen pt-16">
            <Sidebar 
              user={user}
              isOpen={isSidebarOpen}
              onToggle={toggleSidebar}
            />
            
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-80' : 'ml-0'}`}>
              {!currentMood && (
                <div className="bg-white border-b border-gray-200 p-4">
                  <MoodSelector onMoodSelect={handleMoodSelect} />
                </div>
              )}
              
              <div className="flex-1">
                <ChatInterface 
                  user={user} 
                  currentMood={currentMood}
                  onMoodChange={setCurrentMood}
                />
              </div>
            </div>
          </div>
          
          {showBreathingExercise && (
            <BreathingExercise onClose={closeBreathingExercise} />
          )}
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">MindfulChat</h1>
              <p className="text-gray-600">Your AI companion for mental wellness</p>
            </div>

            {currentView === 'login' ? (
              <LoginForm 
                onLogin={handleLogin}
                onToggleSignUp={toggleAuthView}
              />
            ) : (
              <SignUpForm 
                onSignUp={handleSignUp}
                onToggleSignUp={toggleAuthView}
              />
            )}
            
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-semibold mb-2">🚨 Crisis Resources</p>
              <p className="text-xs text-red-700">
                If you're having thoughts of self-harm, please reach out:
                <br />• National Suicide Prevention Lifeline: 988
                <br />• Crisis Text Line: Text HOME to 741741
                <br />• Emergency Services: 911
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;