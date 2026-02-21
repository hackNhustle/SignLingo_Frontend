import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Search, BookOpen, Grid, List, Play, Volume2, X } from 'lucide-react';
import axios from 'axios';
import aslVideoMapping from '../utils/asl_video_mapping.json';
import islDictionaryCsv from '../utils/isl_dictionary.csv?raw';

const getCloudinaryUrl = (id) =>
  id ? `https://res.cloudinary.com/donbtthvf/video/upload/asl_videos/${id}.mp4` : '';

const ASLDictionary = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [allWords, setAllWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoError, setVideoError] = useState('');


  // Load dictionary based on language
  useEffect(() => {
    async function fetchASLDictionaryStrict() {
      setIsLoading(true);
      let words = [];
      let fetched = false;
      const endpoints = [
        'http://localhost:5002/asl/dictionary/all?limit=2000',
        'http://localhost:5002/api/v1/asl/dictionary/all?limit=2000',
      ];
      for (const url of endpoints) {
        try {
          const res = await axios.get(url);
          if (res.data && Array.isArray(res.data.words)) {
            words = res.data.words;
            fetched = true;
            break;
          }
        } catch (e) {
          // Try next endpoint
        }
      }
      if (!fetched) {
        // Fallback to local JSON
        words = Object.keys(aslVideoMapping).flatMap((cat) =>
          Object.entries(aslVideoMapping[cat] || {}).map(([word, videoId]) => ({
            word,
            videoId,
            category: cat,
            videoUrl: getCloudinaryUrl(videoId),
          }))
        );
      }
      // Normalize all entries
      const parsed = words.map((entry) => {
        const word = entry.word || entry.character;
        let videoUrl = entry.video_url;
        let videoId = entry.video_id || entry.videoId;
        if (!videoUrl && videoId) videoUrl = getCloudinaryUrl(videoId);
        return {
          word,
          videoUrl,
          videoId,
          category: entry.category,
        };
      }).filter((entry) => !!entry.word);
      setAllWords(parsed);
      setFilteredWords(parsed);
      setIsLoading(false);
    }

    function fetchISLDictionary() {
      setIsLoading(true);
      try {
        const data = islDictionaryCsv;
        const lines = data.split(/\r?\n/);
        const parsed = lines
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .map(line => {
            const match = line.match(/^(.+?),([a-zA-Z0-9_-]+)$/);
            if (match) {
              const word = match[1].trim();
              const videoId = match[2].trim();
              if (word.toLowerCase() === 'word' && videoId.toLowerCase() === 'videoid') {
                return null;
              }
              return { word, videoId, videoUrl: `https://www.youtube.com/embed/${videoId}` };
            }
            return null;
          })
          .filter(entry => entry !== null && !!entry.word && (!!entry.videoId || !!entry.videoUrl));
        setAllWords(parsed);
        setFilteredWords(parsed);
      } catch {
        setAllWords([]);
        setFilteredWords([]);
      }
      setIsLoading(false);
    }

    if (language === 'ASL') {
      fetchASLDictionaryStrict();
    } else {
      fetchISLDictionary();
    }
  }, [language]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredWords(allWords);
      return;
    }
    const query = searchQuery.trim().toLowerCase();
    const filtered = allWords.filter((entry) => (entry.word || '').toLowerCase().includes(query));
    setFilteredWords(filtered);
  };

  const playWordVideo = (word) => {
    setVideoError('');
    setSelectedWord(word);
    setShowVideoModal(true);
    console.log('selectedWord', word);
  };

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const WordCard = ({ wordData }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
      <div className="relative aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <button
          onClick={() => playWordVideo(wordData)}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all group"
        >
          <Play className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        <span className="text-5xl font-bold text-white capitalize">
          {wordData.word.charAt(0)}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-800 capitalize">{wordData.word}</h3>
          <button
            onClick={() => speakWord(wordData.word)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Speak word"
          >
            <Volume2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 capitalize">
            {wordData.category?.replace('_', ' ')}
          </span>
          <button
            onClick={() => playWordVideo(wordData)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Watch
          </button>
        </div>
      </div>
    </div>
  );

  const WordListItem = ({ wordData }) => (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <span className="text-2xl font-bold text-white capitalize">
            {wordData.word.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 capitalize">{wordData.word}</h3>
          <span className="text-sm text-gray-500 capitalize">
            {wordData.category?.replace('_', ' ')}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => speakWord(wordData.word)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="Speak word"
        >
          <Volume2 className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={() => playWordVideo(wordData)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          {language === 'ASL' ? 'Watch Sign' : 'Watch Video'}
        </button>
      </div>
    </div>
  );

  const VideoModal = () => {
    if (!showVideoModal || !selectedWord) return null;
    const videoUrl = selectedWord.videoUrl;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="asl-video-modal bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 capitalize">{selectedWord.word}</h2>
              <p className="text-gray-500 capitalize">{selectedWord.category?.replace('_', ' ')}</p>
            </div>
            <button
              onClick={() => setShowVideoModal(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
              {language === 'ASL' ? (
                <ASLVideoPlayer videoUrl={videoUrl} word={selectedWord.word} />
              ) : (
                <iframe
                  width="100%"
                  height="100%"
                  src={videoUrl}
                  title={selectedWord.word}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            {videoError ? <p className="mt-3 text-sm text-red-600">{videoError}</p> : null}
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={() => speakWord(selectedWord.word)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                <Volume2 className="w-5 h-5" />
                Speak Word
              </button>
              <button
                onClick={() => {
                  if (language === 'ASL') {
                    const video = document.querySelector('.asl-video-modal video');
                    if (video) video.currentTime = 0;
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors font-medium"
              >
                <Play className="w-5 h-5" />
                Replay
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
// Video diagnostics and fallback UI
function ASLVideoPlayer({ videoUrl, word }) {
  const [error, setError] = useState(false);
  const [diagnostic, setDiagnostic] = useState('');
  console.log('ASLVideoPlayer:', { word, videoUrl });
  if (!videoUrl || videoUrl === '' || typeof videoUrl !== 'string') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-white text-center gap-2">
        <div>Video unavailable for this word (no videoUrl)</div>
        <div className="text-xs text-red-300">videoUrl: {String(videoUrl)}</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-white text-center gap-2">
        <div>Video unavailable for this word (video error)</div>
        {diagnostic && <div className="text-xs text-red-300">{diagnostic}</div>}
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-xs"
        >
          Open video in new tab
        </a>
      </div>
    );
  }
  return (
    <video
      src={videoUrl}
      controls
      autoPlay
      muted
      playsInline
      preload="metadata"
      className="w-full h-full object-contain"
      onError={e => {
        setError(true);
        setDiagnostic('onError: Could not load video.');
        console.error('Video error', { word, videoUrl, event: e });
      }}
      onLoadedData={() => {
        setDiagnostic('onLoadedData: Video loaded.');
        console.log('Video loaded', { word, videoUrl });
      }}
      onCanPlay={() => {
        setDiagnostic('onCanPlay: Video can play.');
        console.log('Video can play', { word, videoUrl });
      }}
    >
      Your browser does not support the video tag.
    </video>
  );
}

  const displayWords = filteredWords;

  // Show fallback if no words loaded
  const noWordsLoaded = !isLoading && (!displayWords || displayWords.length === 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">{language} Dictionary</h1>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search for words... (e.g., hello, cat, run)`}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Search
              </button>
            </div>
          </form>

          {/* View Toggle Only */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
          </div>
        ) : noWordsLoaded ? (
          <div className="text-center py-20">
            <BookOpen className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              No {language} words loaded from API or local mapping
            </h3>
            <p className="text-gray-500">
              Please check your backend API, network, and browser console for errors.<br />
              If you see this message, the frontend did not receive any usable data.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {`${language} DICTIONARY (${displayWords.length} words)`}
                </h2>
              </div>
            </div>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayWords.map((word, index) => (
                  <WordCard key={`${word.word}-${index}`} wordData={word} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {displayWords.map((word, index) => (
                  <WordListItem key={`${word.word}-${index}`} wordData={word} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Video Modal */}
      <VideoModal />
    </div>
  );
};

export default ASLDictionary;
