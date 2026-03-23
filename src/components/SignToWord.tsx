import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from "react-webcam";
import { convertAPI, apiHelpers, getModelBaseUrl, setModelBaseUrl } from '../services/api';

const MODEL_OPTIONS = [
  { label: 'Cloud ISL Model', value: 'https://isl-alphabet-detection-cwfg.onrender.com' },
  { label: 'Cloud ASL Model', value: 'https://asl-alphabet-detection-pxh1.onrender.com' },
  { label: 'Local ISL Model', value: '/model-api' },
  { label: 'Local ASL Model', value: '/asl-api' },
];

export default function SignToWord() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedSign, setDetectedSign] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [modelUrl, setModelUrl] = useState(getModelBaseUrl());

  // Capture image and send to backend for recognition
  const captureAndRecognize = useCallback(async () => {
    if (!webcamRef.current || isProcessing) return;

    setIsProcessing(true);
    setError('');

    try {
      // Capture image from webcam
      const imageSrc = webcamRef.current.getScreenshot();

      if (!imageSrc) {
        throw new Error('Failed to capture image from camera');
      }

      // Send to backend for recognition
      const response = await convertAPI.signToText(imageSrc, modelUrl);

      console.log('Sign recognition response:', response.data);

      if (response.data?.error) {
        setError(response.data.error);
        setDetectedSign('');
        setConfidence(0);
        return;
      }

      if (response.data?.prediction) {
        const sign = String(response.data.prediction).toUpperCase();
        const conf = Number(response.data.confidence ?? 0);
        setDetectedSign(sign);
        setConfidence(Math.round(conf * 100));
        setDetectionHistory(prev => [
          { sign, confidence: conf, timestamp: new Date() },
          ...prev.slice(0, 4)
        ]);
        return;
      }

      if (Array.isArray(response.data?.predictions) && response.data.predictions.length > 0) {
        const topResult = response.data.predictions[0];
        const rawSign =
          topResult.sign ??
          topResult.label ??
          topResult.prediction ??
          topResult.class ??
          topResult.letter ??
          topResult.name;
        const sign = String(rawSign || '').toUpperCase();
        const conf = Number(
          topResult.confidence ??
          topResult.score ??
          topResult.probability ??
          topResult.conf ??
          0
        );

        if (sign) {
          setDetectedSign(sign);
          setConfidence(Math.round(conf * 100));
          setDetectionHistory(prev => [
            { sign, confidence: conf, timestamp: new Date() },
            ...prev.slice(0, 4)
          ]);
          return;
        }
      }

      if (response.data?.detailed_results && response.data.detailed_results.length > 0) {
        const topResult = response.data.detailed_results[0];
        setDetectedSign(topResult.sign.toUpperCase());
        setConfidence(Math.round(topResult.confidence * 100));

        // Add to history
        setDetectionHistory(prev => [
          { sign: topResult.sign, confidence: topResult.confidence, timestamp: new Date() },
          ...prev.slice(0, 4) // Keep last 5 detections
        ]);
        return;
      }

      setDetectedSign('NO SIGN DETECTED');
      setConfidence(0);
    } catch (err) {
      console.error('Sign recognition error:', err);
      setError(apiHelpers.handleError(err));

      // Do not show random fallback on real errors
      setDetectedSign('');
      setConfidence(0);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  // Auto-detect every 2 seconds when detecting is enabled
  React.useEffect(() => {
    let interval;
    if (isDetecting && !isProcessing) {
      interval = setInterval(captureAndRecognize, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDetecting, isProcessing, captureAndRecognize]);

  // Toggle detection
  const toggleDetection = () => {
    setIsDetecting(!isDetecting);
    if (!isDetecting) {
      setError('');
      setDetectedSign('');
      setConfidence(0);
    }
  };

  const handleModelChange = (e) => {
    const nextUrl = e.target.value;
    setModelUrl(nextUrl);
    setModelBaseUrl(nextUrl);
    setError('');
    setDetectedSign('');
    setConfidence(0);
  };

  // Speak the detected word
  const speakWord = () => {
    if (detectedSign && detectedSign !== 'NO SIGN DETECTED') {
      const utterance = new SpeechSynthesisUtterance(detectedSign.toLowerCase());
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  // Manual capture
  const handleManualCapture = () => {
    if (!isDetecting) {
      captureAndRecognize();
    }
  };

  return (
    <div className="flex safe-h-screen w-full flex-col group/design-root">
      {/* Camera Viewport (Background) */}
      <div className="absolute inset-0 z-0 bg-black">
        <Webcam
          ref={webcamRef}
          audio={false}
          className="absolute inset-0 h-full w-full object-cover"
          videoConstraints={{
            facingMode: "user",
            width: 640,
            height: 480
          }}
          screenshotFormat="image/jpeg"
          screenshotQuality={0.8}
        />
        {/* Dark Overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* Top Navigation Bar */}
      <div className="relative z-20 flex items-center justify-between gap-3 p-4 pt-8">
        <button onClick={() => navigate(-1)} className="flex size-12 shrink-0 items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 active:scale-95 transition-all hover:bg-black/40">
          <span className="material-symbols-outlined text-white">arrow_back</span>
        </button>

        {/* Status Indicator */}
        {/*
        <div className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full backdrop-blur-md border pl-3 pr-5 shadow-lg transition-all ${
          error ? 'bg-red-500/40 border-red-400/30 shadow-red-500/10' :
          isProcessing ? 'bg-yellow-500/40 border-yellow-400/30 shadow-yellow-500/10' :
          isDetecting ? 'bg-neon-teal/40 border-neon-teal/30 shadow-neon-teal/10' :
          'bg-black/40 border-white/10'
        }`}>
          <span className={`material-symbols-outlined text-[20px] ${
            error ? 'text-red-300' :
            isProcessing ? 'text-yellow-300 animate-spin' :
            isDetecting ? 'text-neon-teal animate-pulse' :
            'text-white'
          }`}>
            {error ? 'error' : isProcessing ? 'hourglass_empty' : isDetecting ? 'graphic_eq' : 'visibility'}
          </span>
          <p className="text-white text-sm font-medium tracking-wide">
            {error ? 'Error Occurred' :
             isProcessing ? 'Processing...' :
             isDetecting ? 'Detecting Signs...' :
             'Ready to Detect'}
          </p>
        </div>
        */}

        {/* Model Switcher */}
        <div className="flex items-center gap-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 px-3 py-2">
          <span className="material-symbols-outlined text-white text-[18px]">tune</span>
          <select
            value={modelUrl}
            onChange={handleModelChange}
            className="bg-transparent text-white text-xs font-semibold tracking-wide outline-none max-w-[140px]"
          >
            {MODEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-black">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Detection Toggle */}
        <button
          onClick={toggleDetection}
          className={`flex size-12 shrink-0 items-center justify-center rounded-full backdrop-blur-md border active:scale-95 transition-all ${isDetecting ? 'bg-red-500/40 border-red-400/30 hover:bg-red-500/60' : 'bg-green-500/40 border-green-400/30 hover:bg-green-500/60'
            }`}
        >
          <span className="material-symbols-outlined text-white">
            {isDetecting ? 'stop' : 'play_arrow'}
          </span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="absolute top-24 left-4 right-4 z-30 p-3 bg-red-500/90 backdrop-blur-md border border-red-400/30 rounded-lg">
          <p className="text-white text-sm font-medium text-center">{error}</p>
        </div>
      )}

      {/* Central Focus Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none pb-24">
        <div className={`relative w-[70%] aspect-[3/4] max-w-xs rounded-xl border-2 border-dashed bg-neon-teal/5 transition-all ${isDetecting ? 'border-neon-teal/60 shadow-[0_0_20px_rgba(20,184,166,0.3)]' : 'border-white/30'
          }`}>
          {/* Corner Indicators */}
          <div className={`absolute -top-[2px] -left-[2px] h-6 w-6 rounded-tl-xl border-l-4 border-t-4 transition-colors ${isDetecting ? 'border-neon-teal' : 'border-white/50'
            }`} />
          <div className={`absolute -top-[2px] -right-[2px] h-6 w-6 rounded-tr-xl border-r-4 border-t-4 transition-colors ${isDetecting ? 'border-neon-teal' : 'border-white/50'
            }`} />
          <div className={`absolute -bottom-[2px] -left-[2px] h-6 w-6 rounded-bl-xl border-l-4 border-b-4 transition-colors ${isDetecting ? 'border-neon-teal' : 'border-white/50'
            }`} />
          <div className={`absolute -bottom-[2px] -right-[2px] h-6 w-6 rounded-br-xl border-r-4 border-b-4 transition-colors ${isDetecting ? 'border-neon-teal' : 'border-white/50'
            }`} />

          {/* Animated Scanning Line */}
          {isDetecting && (
            <div className="absolute left-2 right-2 h-0.5 bg-neon-teal shadow-[0_0_15px_#14b8a6] animate-scan" />
          )}

          {/* Manual Capture Button */}
          {!isDetecting && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
              <button
                onClick={handleManualCapture}
                disabled={isProcessing}
                className="flex items-center justify-center size-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 active:scale-95 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-white text-xl">
                  {isProcessing ? 'hourglass_empty' : 'camera_alt'}
                </span>
              </button>
            </div>
          )}

          {/* Helper Text */}
          <div className="absolute -bottom-12 w-full flex justify-center">
            <p className="text-white/90 text-sm font-medium bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/5">
              {isDetecting ? 'Auto-detecting signs...' : 'Tap camera to capture'}
            </p>
          </div>
        </div>
      </div>

      {/* Detection History */}
      {detectionHistory.length > 0 && (
        <div className="absolute top-32 right-4 z-20 max-w-[200px]">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-3">
            <p className="text-white/70 text-xs font-medium mb-2 uppercase tracking-wide">Recent Detections</p>
            <div className="space-y-1">
              {detectionHistory.slice(0, 3).map((item, index) => (
                <div key={index} className="flex justify-between items-center text-xs">
                  <span className="text-white font-medium">{item.sign}</span>
                  <span className="text-neon-teal">{Math.round(item.confidence * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Result Bottom Sheet */}
      <div className="absolute bottom-0 left-0 z-30 w-full">
        <div className="flex flex-col bg-white dark:bg-[#1A1D1D] rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.5)] p-5 pb-6 transition-colors">
          {/* Handle */}
          <div className="flex w-full items-center justify-center pb-4">
            <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-600" />
          </div>

          {/* Content Grid */}
          <div className="flex items-center justify-between gap-4 mb-6">
            {/* Text Result */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Detected Sign</span>
              <h1 className={`text-4xl font-bold tracking-tight transition-colors ${detectedSign && detectedSign !== 'NO SIGN DETECTED' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'
                }`}>
                {detectedSign || 'WAITING...'}
              </h1>
              {error && (
                <p className="text-sm text-red-500 font-medium mt-1">Recognition failed</p>
              )}
            </div>

            {/* Confidence Score Ring */}
            <div className="relative flex items-center justify-center size-16">
              <svg className="h-full w-full rotate-[-90deg]" viewBox="0 0 36 36">
                <path className="text-gray-100 dark:text-gray-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path
                  className={`drop-shadow-[0_0_4px_rgba(20,184,166,0.4)] transition-all ${confidence > 80 ? 'text-green-500' : confidence > 60 ? 'text-yellow-500' : 'text-red-500'
                    }`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={`${confidence}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xs font-bold text-gray-900 dark:text-white leading-none">{confidence}%</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {/* Speak Button */}
            <button
              onClick={speakWord}
              disabled={!detectedSign || detectedSign === 'NO SIGN DETECTED'}
              className="flex-1 relative overflow-hidden rounded-2xl bg-primary p-4 shadow-xl shadow-primary/20 active:scale-[0.99] transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center justify-center size-8 rounded-full bg-white/20">
                  <span className="material-symbols-outlined text-white text-[20px]">volume_up</span>
                </div>
                <span className="text-lg font-bold text-white tracking-wide">Speak</span>
              </div>
            </button>

            {/* Manual Capture Button */}
            <button
              onClick={handleManualCapture}
              disabled={isProcessing || isDetecting}
              className="flex items-center justify-center size-16 rounded-2xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95 transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-gray-700 dark:text-gray-300 text-[24px]">
                {isProcessing ? 'hourglass_empty' : 'camera_alt'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 8px; }
          50% { top: 50%; }
          100% { top: calc(100% - 8px); }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
