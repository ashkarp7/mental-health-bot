// src/services/voiceRecognition.js

let mediaRecorder = null;
let audioChunks = [];
let recognition = null;
let currentStream = null;

// Initialize Speech Recognition
const initializeSpeechRecognition = () => {
  if ('webkitSpeechRecognition' in window) {
    recognition = new window.webkitSpeechRecognition();
  } else if ('SpeechRecognition' in window) {
    recognition = new window.SpeechRecognition();
  } else {
    console.warn('Speech recognition not supported in this browser');
    return null;
  }

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  return recognition;
};

// Check MediaRecorder support and get supported MIME type
const getSupportedMimeType = () => {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/ogg',
    'audio/wav',
    'audio/mp4'
  ];
  
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  
  return null; // No supported type found
};

// Start voice recording with Web Audio API
export const startVoiceRecording = async (onResult, onError) => {
  try {
    // Clean up any existing recording
    await stopVoiceRecording();

    // Always create a fresh speech recognition instance to avoid state issues
    recognition = initializeSpeechRecognition();

    if (!recognition) {
      throw new Error('Speech recognition not supported');
    }

    // Get microphone access
    try {
      currentStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });
    } catch (micError) {
      throw new Error(`Microphone access denied: ${micError.message}`);
    }

    // Check if MediaRecorder is supported
    if (!window.MediaRecorder) {
      throw new Error('MediaRecorder not supported in this browser');
    }

    // Get supported MIME type
    const mimeType = getSupportedMimeType();
    if (!mimeType) {
      console.warn('No supported audio MIME type found, using default');
    }

    // Setup MediaRecorder for audio recording
    let recordingMimeType = 'audio/webm'; // Store mimeType for later use
    try {
      const options = mimeType ? { mimeType } : undefined;
      mediaRecorder = new MediaRecorder(currentStream, options);
      recordingMimeType = mediaRecorder.mimeType || mimeType || 'audio/webm';
    } catch (recorderError) {
      // Fallback without options if the specified MIME type fails
      mediaRecorder = new MediaRecorder(currentStream);
      recordingMimeType = mediaRecorder.mimeType || 'audio/webm';
    }

    audioChunks = [];

    // Setup MediaRecorder event handlers
    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      if (audioChunks.length > 0) {
        const audioBlob = new Blob(audioChunks, { 
          type: recordingMimeType 
        });
        console.log('Audio recording stopped, blob size:', audioBlob.size);
        
        // Reset chunks for next recording
        audioChunks = [];
      }
    };

    mediaRecorder.onerror = (event) => {
      console.error('MediaRecorder error:', event.error);
      if (onError) {
        onError(`Recording error: ${event.error}`);
      }
    };

    // Setup speech recognition handlers
    recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    recognition.onresult = (event) => {
      if (event.results && event.results.length > 0) {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        console.log('Speech recognition result:', transcript, 'Confidence:', confidence);
        
        if (onResult) {
          onResult(transcript, confidence);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      let errorMessage = 'Speech recognition error';
      switch (event.error) {
        case 'network':
          errorMessage = 'Network error - please check your internet connection';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied - please allow microphone access';
          break;
        case 'no-speech':
          errorMessage = 'No speech detected - please try speaking again';
          break;
        case 'audio-capture':
          errorMessage = 'Audio capture error - please check your microphone';
          break;
        case 'service-not-allowed':
          errorMessage = 'Speech service not allowed';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }
      
      if (onError) {
        onError(errorMessage);
      }
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      // Don't clean up here - let the explicit stop handle cleanup
      // This prevents race conditions
    };

    // Start recording - MediaRecorder first, then speech recognition
    if (mediaRecorder.state === 'inactive') {
      mediaRecorder.start(1000); // Collect data every second
    }
    
    // Start speech recognition with a small delay and proper state checking
    setTimeout(() => {
      if (recognition && recognition.state !== 'started') {
        try {
          recognition.start();
        } catch (startError) {
          console.error('Error starting speech recognition:', startError);
          if (onError) {
            onError(`Failed to start speech recognition: ${startError.message}`);
          }
        }
      }
    }, 100);

    return true;

  } catch (error) {
    console.error('Error starting voice recording:', error);
    
    // Clean up on error
    await cleanup();
    
    if (onError) {
      onError(error.message);
    }
    return false;
  }
};

// Clean up resources
const cleanup = async () => {
  // Stop speech recognition first
  if (recognition) {
    try {
      // Check if recognition is actually running before stopping
      if (recognition.state === 'started') {
        recognition.stop();
      }
      // Wait for recognition to fully stop
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (e) {
      console.warn('Error stopping recognition:', e);
    }
    // Always create a new instance next time to avoid state issues
    recognition = null;
  }

  // Stop media recorder
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    try {
      mediaRecorder.stop();
      // Wait a bit for the stop event to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (e) {
      console.warn('Error stopping media recorder:', e);
    }
  }

  // Stop all audio tracks to release microphone
  if (currentStream) {
    currentStream.getTracks().forEach(track => {
      try {
        track.stop();
      } catch (e) {
        console.warn('Error stopping track:', e);
      }
    });
    currentStream = null;
  }

  // Reset variables
  setTimeout(() => {
    mediaRecorder = null;
    audioChunks = [];
  }, 200);
};

// Stop voice recording
export const stopVoiceRecording = async () => {
  try {
    await cleanup();
    return true;
  } catch (error) {
    console.error('Error stopping voice recording:', error);
    return false;
  }
};

// Check if voice recognition is supported
export const isVoiceRecognitionSupported = () => {
  return ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && 
         ('MediaRecorder' in window) && 
         ('getUserMedia' in navigator.mediaDevices);
};

// Check microphone permission
export const checkMicrophonePermission = async () => {
  try {
    const permission = await navigator.permissions.query({ name: 'microphone' });
    return permission.state; // 'granted', 'denied', or 'prompt'
  } catch (error) {
    console.warn('Could not check microphone permission:', error);
    return 'unknown';
  }
};

// Simple sentiment analysis for voice input
export const analyzeVoiceSentiment = (transcript) => {
  if (!transcript || typeof transcript !== 'string') {
    return 'neutral';
  }

  const lowerTranscript = transcript.toLowerCase();
  
  const positiveWords = ['happy', 'good', 'great', 'amazing', 'wonderful', 'excellent', 'fantastic', 'love', 'excited', 'joy', 'better', 'fine', 'okay', 'well'];
  const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'angry', 'frustrated', 'depressed', 'anxious', 'worried', 'upset', 'down', 'horrible'];
  const stressWords = ['stressed', 'overwhelmed', 'tired', 'exhausted', 'pressure', 'difficult', 'hard', 'struggle', 'can\'t', 'unable', 'impossible'];

  let positiveScore = 0;
  let negativeScore = 0;
  let stressScore = 0;

  const words = lowerTranscript.split(/\s+/);

  words.forEach(word => {
    // Remove punctuation
    const cleanWord = word.replace(/[^\w]/g, '');
    if (positiveWords.includes(cleanWord)) positiveScore++;
    if (negativeWords.includes(cleanWord)) negativeScore++;
    if (stressWords.includes(cleanWord)) stressScore++;
  });

  if (stressScore > 0) return 'stressed';
  if (negativeScore > positiveScore) return 'negative';
  if (positiveScore > negativeScore) return 'positive';
  return 'neutral';
};

// Text-to-Speech for AI responses
export const speakText = (text, options = {}) => {
  const { rate = 0.9, pitch = 1, volume = 0.8, voiceName = null } = options;
  
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-speech not supported in this browser');
    return false;
  }

  if (!text || text.trim() === '') {
    console.warn('No text provided for speech synthesis');
    return false;
  }

  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = Math.max(0.1, Math.min(2, rate));
    utterance.pitch = Math.max(0, Math.min(2, pitch));
    utterance.volume = Math.max(0, Math.min(1, volume));
    
    // Wait for voices to be loaded
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      
      if (voices.length === 0) {
        // Voices not loaded yet, try again
        setTimeout(setVoice, 100);
        return;
      }

      let selectedVoice = null;

      if (voiceName) {
        selectedVoice = voices.find(voice => voice.name === voiceName);
      }

      if (!selectedVoice) {
        // Try to find a female voice for more empathetic feel
        selectedVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('female') || 
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('karen') ||
          voice.name.toLowerCase().includes('siri') ||
          (voice.gender && voice.gender.toLowerCase() === 'female')
        );
      }

      if (!selectedVoice) {
        // Fallback to English voices
        selectedVoice = voices.find(voice => 
          voice.lang.startsWith('en') && voice.localService
        );
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Event handlers
      utterance.onstart = () => {
        console.log('Text-to-speech started');
      };

      utterance.onend = () => {
        console.log('Text-to-speech ended');
      };

      utterance.onerror = (event) => {
        console.error('Text-to-speech error:', event.error);
      };

      window.speechSynthesis.speak(utterance);
    };

    setVoice();
    return true;

  } catch (error) {
    console.error('Error in text-to-speech:', error);
    return false;
  }
};

// Stop text-to-speech
export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    return true;
  }
  return false;
};

// Get available voices
export const getAvailableVoices = () => {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.getVoices();
  }
  return [];
};

// Test microphone access
export const testMicrophone = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Microphone test failed:', error);
    return false;
  }
};

export default {
  startVoiceRecording,
  stopVoiceRecording,
  isVoiceRecognitionSupported,
  checkMicrophonePermission,
  analyzeVoiceSentiment,
  speakText,
  stopSpeaking,
  getAvailableVoices,
  testMicrophone
};