import React, { useState, useRef, useEffect } from 'react';
import { startVoiceRecording, stopVoiceRecording, isVoiceRecognitionSupported, analyzeVoiceSentiment } from '../../services/voiceRecognition';

const InputArea = ({ onSendMessage, isLoading }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState('');
  const recordingIntervalRef = useRef(null);
  const autoStopTimeoutRef = useRef(null);

  

  useEffect(() => {
    // Check if voice recognition is supported
    setVoiceSupported(isVoiceRecognitionSupported());
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current);
      }
      if (isRecording) {
        stopVoiceRecording();
      }
    };
  }, [isRecording]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      // Stop recording if it's active before sending
      if (isRecording) {
        stopRecording();
      }
      onSendMessage(inputMessage);
      setInputMessage('');
      setTranscriptionStatus(''); // Clear any status
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const startRecording = async () => {
    if (!voiceSupported) {
      alert('Voice recognition is not supported in your browser.');
      return;
    }

    try {
      setIsRecording(true);
      setRecordingTime(0);
      setTranscriptionStatus('Starting recording...');
      
      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Auto-stop after 60 seconds (increased from 30)
      autoStopTimeoutRef.current = setTimeout(() => {
        console.log('Auto-stopping recording after 60 seconds');
        stopRecording();
      }, 60000);

      const success = await startVoiceRecording(
        // On speech recognition result
        (transcript, confidence) => {
          console.log('Speech recognition result:', transcript, 'Confidence:', confidence);
          
          if (transcript && transcript.trim()) {
            setInputMessage(transcript);
            setTranscriptionStatus(`Transcribed (${Math.round((confidence || 0) * 100)}% confidence)`);
            
            // Analyze sentiment and provide feedback
            const sentiment = analyzeVoiceSentiment(transcript);
            console.log('Voice sentiment:', sentiment);
            
            // Don't auto-stop - let user decide when to stop or send
            // User can manually stop recording or send the message
          }
        },
        // On error
        (error) => {
          console.error('Voice recognition error:', error);
          setTranscriptionStatus(`Error: ${error}`);
          
          // Show user-friendly error message
          if (error.includes('not-allowed') || error.includes('denied')) {
            alert('Microphone access denied. Please allow microphone access and try again.');
          } else if (error.includes('network')) {
            alert('Network error. Please check your internet connection and try again.');
          } else if (error.includes('no-speech')) {
            // Don't show alert for no-speech, just update status
            setTranscriptionStatus('No speech detected. Please try speaking again.');
          } else {
            alert(`Voice recognition error: ${error}`);
          }
          
          // Don't auto-stop on no-speech error, let user try again
          if (!error.includes('no-speech')) {
            stopRecording();
          }
        }
      );
      
      if (success) {
        setTranscriptionStatus('Listening... Please speak now');
      } else {
        setTranscriptionStatus('Failed to start recording');
        stopRecording();
      }
      
    } catch (error) {
      console.error('Error starting voice recording:', error);
      setTranscriptionStatus(`Error: ${error.message}`);
      alert('Could not start voice recording. Please check your microphone permissions and try again.');
      stopRecording();
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;

    try {
      // Clear timers
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current);
        autoStopTimeoutRef.current = null;
      }

      // Stop the voice recording service
      await stopVoiceRecording();
      
      setIsRecording(false);
      setRecordingTime(0);
      
      // Clear status after a delay if no error
      setTimeout(() => {
        if (!transcriptionStatus.includes('Error')) {
          setTranscriptionStatus('');
        }
      }, 5000);
      
    } catch (error) {
      console.error('Error stopping voice recording:', error);
      setIsRecording(false);
      setRecordingTime(0);
      setTranscriptionStatus('Error stopping recording');
    }
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

      {/* Recording Status */}
      {isRecording && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-600">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Recording: {formatRecordingTime(recordingTime)}</span>
            <span className="text-xs">(Tap microphone to stop)</span>
          </div>
          {transcriptionStatus && (
            <div className="mt-1 text-xs text-gray-600">
              {transcriptionStatus}
            </div>
          )}
        </div>
      )}

      {/* Transcription Status (when not recording) */}
      {!isRecording && transcriptionStatus && (
        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-700">
            {transcriptionStatus}
          </div>
        </div>
      )}
      
      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="flex space-x-3">
        {/* Voice Recording Button */}
        {voiceSupported && (
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg transition duration-200 flex items-center justify-center min-w-[44px] ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse hover:bg-red-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
            title={isRecording ? 'Stop recording' : 'Start voice recording'}
          >
            {isRecording ? '⏹️' : '🎤'}
          </button>
        )}
        
        {/* Text Input */}
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
      
      {/* Voice Recognition Status */}
      {!voiceSupported && (
        <div className="mt-2 text-center">
          <p className="text-xs text-orange-600">
            Voice recognition not supported in this browser
          </p>
        </div>
      )}
      
      {/* Emergency Support */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500">
          In crisis? Contact{' '}
          <a href="tel:988" className="text-indigo-600 hover:underline font-medium">
            988 Suicide & Crisis Lifeline
          </a>
          {' '}or{' '}
          <a href="tel:911" className="text-red-600 hover:underline font-medium">
            911
          </a>
        </p>
      </div>
    </div>
  );
};

export default InputArea;