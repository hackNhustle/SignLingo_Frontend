import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import Avatar3D from './Avatar3D';
import LanguageToggle from './LanguageToggle';
import { convertAPI, apiHelpers } from '../services/api';

export default function Translator() {
  const navigate = useNavigate();
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const avatarRef = useRef<any>(null);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Convert text to ISL signs via backend
  const handleTextToSign = async (text: string) => {
    if (!text.trim()) return;

    setIsProcessing(true);
    setError('');

    try {
      const response = await convertAPI.textToSign({
        text: text.trim(),
        language: 'en',
        speed: 'normal'
      });

      console.log('Backend response:', response.data);

      // Trigger avatar animation
      if (avatarRef.current) {
        setIsAnimating(true);
        avatarRef.current.performSign(text);
        setTimeout(() => setIsAnimating(false), response.data.total_duration * 1000 || 3000);
      }
    } catch (err) {
      console.error('Text to sign error:', err);
      setError(apiHelpers.handleError(err));

      // Fallback to local animation
      if (avatarRef.current) {
        setIsAnimating(true);
        avatarRef.current.performSign(text);
        setTimeout(() => setIsAnimating(false), 3000);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Convert speech to ISL signs via backend
  const handleSpeechToSign = async (audioData: any) => {
    setIsProcessing(true);
    setError('');

    try {
      const response = await convertAPI.speechToSign({
        audio_data: audioData,
        language: 'en',
        speech_speed: 'normal'
      });

      console.log('Speech to sign response:', response.data);

      // Update transcript with backend result
      const transcribedText = response.data.transcribed_text;
      if (transcribedText && avatarRef.current) {
        setIsAnimating(true);
        avatarRef.current.performSign(transcribedText);
        setTimeout(() => setIsAnimating(false), response.data.total_duration * 1000 || 3000);
      }
    } catch (err) {
      console.error('Speech to sign error:', err);
      setError(apiHelpers.handleError(err));
    } finally {
      setIsProcessing(false);
    }
  };

  const prevListeningRef = useRef(listening);

  useEffect(() => {
    if (prevListeningRef.current && !listening) {
      if (transcript && !isProcessing) {
        handleTextToSign(transcript);
      }
    }
    prevListeningRef.current = listening;
  }, [listening, transcript, isProcessing]);

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      setTextInput('');
      setShowTextInput(false);
      setError('');
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }
  };

  const handleTextInputToggle = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    }
    setShowTextInput(!showTextInput);
    setError('');
  };

  const handleStartAnimation = () => {
    const text = textInput || transcript;
    if (text) {
      handleTextToSign(text);
    }
  };

  const handleReset = () => {
    SpeechRecognition.abortListening();
    resetTranscript();
    setTextInput('');
    setError('');
    setIsProcessing(false);
    setIsAnimating(false);
  };

  const displayText = textInput || transcript;

  console.log('Transcript:', transcript, 'Listening:', listening, 'DisplayText:', displayText);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6">
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4">mic_off</span>
          <p className="text-lg font-semibold text-slate-700 dark:text-white mb-2">Speech Recognition Not Supported</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Please use a modern browser like Chrome or Firefox</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full max-w-md flex-col bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden group/design-root safe-h-screen">
      <div className="absolute inset-0 z-0 top-glow" />

      {/* top Half: Output & Avatar Area */}
      <div className="flex-[0.55] relative flex flex-col w-full -mt-8 pt-16 rounded-t-[3rem] shadow-inner overflow-hidden" style={{ background: 'linear-gradient(to bottom, #0c1f21, #000000)' }}>
        {/* Header Bar - Back Button + Connection */}
        <div className="w-full px-4 flex items-center justify-between gap-3 mb-4">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex size-10 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 shadow-sm active:scale-95 transition-all flex-shrink-0"
          >
            <span className="material-symbols-outlined text-slate-900 dark:text-white text-xl">arrow_back</span>
          </button>

          {/* Connection Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 shadow-lg border dark-gradient ${isProcessing ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-300 border-yellow-500/30' :
              error ? 'bg-red-500/20 text-red-600 dark:text-red-300 border-red-500/30' :
                'bg-green-500/20 text-green-600 dark:text-green-300 border-green-500/30'
            }`}>
            <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-yellow-500 dark:bg-yellow-400 animate-pulse' :
                error ? 'bg-red-500 dark:bg-red-400' :
                  'bg-green-500 dark:bg-green-400'
              }`} />
            {isProcessing ? 'Processing...' : error ? 'Error' : 'Connected'}
          </div>
        </div>
        {/* Avatar Area */}
        <div className="flex-1 flex flex-col items-center justify-center relative w-full min-h-0">
          {/* 3D Avatar Container - Flexible dimensions */}
          <div className="relative w-full h-full max-h-[320px] flex items-center justify-center">
            <Avatar3D ref={avatarRef} />
          </div>

          {/* Floating Status Card */}
          {/* {(isAnimating || isProcessing) && (
            <div className="absolute top-[60px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-8">
              <div className="bg-white/80 dark:bg-black/60 backdrop-blur-md border border-white/40 dark:border-white/10 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-800 dark:text-slate-100 text-sm font-semibold whitespace-nowrap">
                  {isProcessing ? 'Processing with AI...' : 'Performing Sign Language...'}
                </p>
              </div>
            </div>
          )} */}
        </div>

        {/* Footer Controls */}
        <div className="w-full px-6 pb-6 pt-3">
          <div className="flex justify-between items-center bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-2xl p-2 shadow-sm border border-white/40 dark:border-white/10">

            {/* Keyboard Input */}
            <button
              onClick={handleTextInputToggle}
              disabled={isProcessing}
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 rounded-xl  transition-colors group disabled:opacity-50 ${showTextInput ? 'bg-primary/10' : ''
                }`}
            >
              <div className="p-2 rounded-full bg-transparent transition-colors">
                <span className={`material-symbols-outlined text-2xl ${showTextInput ? 'text-primary' : 'text-slate-600 dark:text-slate-300'
                  }`}>keyboard</span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Type</span>
            </button>
            {/* Divider */}
            <div className="w-px h-8 bg-slate-300/50 dark:bg-white/10" />
            {/* Start Animation */}
            <button
              onClick={handleStartAnimation}
              disabled={!displayText || isProcessing || isAnimating}
              className="flex flex-1 flex-col items-center justify-center gap-1 py-2 rounded-xl  transition-colors disabled:opacity-50"
            >
              <div className="p-2 rounded-full bg-transparent transition-colors">
                <span className={`material-symbols-outlined text-2xl  transition-colors ${isProcessing || isAnimating ? 'text-slate-400 dark:text-slate-600' : 'text-slate-600 dark:text-slate-300 group-hover:text-primary'
                  }`}>
                  {isProcessing || isAnimating ? 'hourglass_empty' : 'play_arrow'}
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Play</span>
            </button>
            {/* Divider */}
            <div className="w-px h-8 bg-slate-300/50 dark:bg-white/10" />
            {/* Reset */}
            <button
              onClick={handleReset}
              disabled={isProcessing || isAnimating}
              className="flex flex-1 flex-col items-center justify-center gap-1 py-2 rounded-xl transition-colors group disabled:opacity-50"
            >
              <div className="p-2 rounded-full bg-transparent transition-colors">
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-2xl">replay</span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Reset</span>
            </button>
          </div>
        </div>
      </div>
      {/* bottom Half: Input Area */}
      <div className="flex-[0.45] flex flex-col items-center justify-start pt-4 pb-6 bg-background-light dark:bg-background-dark relative z-10 rounded-t-[3rem] shadow-lg border-b border-slate-200 dark:border-slate-700 dark-gradient">


        {/* Language Toggle - Full Width */}
        <div className="w-full px-4 mb-4">
          <LanguageToggle />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Main Microphone Interaction */}
        <div className="flex flex-col items-center justify-center gap-4 mb-4 relative w-full px-6">
          <h1 className="text-slate-900 dark:text-white tracking-tight text-[28px] font-bold leading-tight text-center">
            {isProcessing ? 'Processing...' :
              listening ? 'Listening...' :
                showTextInput ? 'Type Your Text' :
                  'Tap to Listen'}
          </h1>

          {/* Text Input Field */}
          {showTextInput && (
            <div className="w-full max-w-sm">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your message here..."
                className="w-full bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 shadow-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-base resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={2}
                disabled={isProcessing}
              />
            </div>
          )}

          {!showTextInput && (
            <div className="relative flex items-center justify-center">
              {/* Ripple Effects */}
              {(listening || isProcessing) && (
                <>
                  <div className="absolute w-20 h-20 bg-primary/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                  <div className="absolute w-20 h-20 bg-primary/40 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] delay-75" />
                </>
              )}
              {/* Main Button */}
              <button
                onClick={handleMicClick}
                disabled={isProcessing}
                className={`relative z-10 flex h-20 w-20 cursor-pointer items-center justify-center rounded-full ${isProcessing ? 'bg-yellow-500' :
                    listening ? 'bg-red-500' :
                      'bg-primary'
                  } text-white shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                <span className="material-symbols-outlined text-3xl">
                  {isProcessing ? 'hourglass_empty' : listening ? 'stop' : 'mic'}
                </span>
              </button>
            </div>
          )}

          {/* Transcript Display - Moved Below Button */}
          {displayText && !showTextInput && (
            <div className="bg-white absolute top-[180px] dark:bg-slate-800 rounded-2xl px-6 py-3 shadow-lg border border-slate-200 dark:border-slate-700 max-w-sm w-full">
              <p className="text-slate-800 dark:text-white text-sm font-medium text-center">{displayText}</p>
            </div>
          )}

          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            {isProcessing ? 'Converting to sign language...' :
              listening ? 'Tap to stop' :
                showTextInput ? 'Type your message above' :
                  'Tap microphone to start'}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
