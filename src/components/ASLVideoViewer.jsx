import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { learningAPI } from '../services/api';

const API_URL = 'http://localhost:5002';

const ASLVideoViewer = ({ letter }) => {
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (letter) {
      loadLetterVideo(letter);
    }
  }, [letter]);

  const loadLetterVideo = async (char) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await learningAPI.getCharacterData(char);
      const data = response.data.character_data || response.data;

      if (data.asl_video_url) {
        setVideoData(data);
      } else {
        setError('Video not available for this letter');
      }
    } catch (err) {
      console.error('Error loading ASL video:', err);
      setError('Failed to load video');
    } finally {
      setIsLoading(false);
    }
  };

  if (!letter) return null;

  if (isLoading) {
    return (
      <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg bg-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const resolvedVideoUrl =
    videoData?.asl_video_url || (videoData?.video_url ? `${API_URL}${videoData.video_url}` : '');

  if (error || !videoData || !resolvedVideoUrl) {
    return (
      <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <div className="text-center text-white p-6">
          <p className="text-6xl font-bold mb-2">{letter}</p>
          <p className="text-lg">{error || 'Video not available'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg">
      <video
        ref={videoRef}
        src={resolvedVideoUrl}
        controls
        autoPlay
        loop
        className="w-full aspect-video object-cover bg-black"
        title={`ASL Sign for ${letter}`}
      >
        Your browser does not support the video tag.
      </video>
      <div className="bg-white p-4 text-center">
        <p className="text-lg font-semibold text-gray-800">
          ASL Sign: <span className="text-2xl text-indigo-600">{letter}</span>
        </p>
        <p className="text-sm text-gray-500 capitalize">
          {videoData.type === 'letter' ? 'Letter' : 'Number'}
        </p>
      </div>
    </div>
  );
};

export default ASLVideoViewer;
