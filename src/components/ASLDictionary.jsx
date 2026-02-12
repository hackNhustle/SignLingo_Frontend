import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Grid, List, Play, Volume2, ChevronRight, X } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5002';

const ASLDictionary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('common_words');
  const [searchResults, setSearchResults] = useState([]);
  const [categoryWords, setCategoryWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Load categories and common words on mount
  useEffect(() => {
    console.log('Component mounted - loading categories and common words');
    loadCategories();
    loadCategoryWords('common_words');
  }, []);

  // Load category words when category changes
  useEffect(() => {
    console.log('Category changed to:', selectedCategory);
    if (selectedCategory && selectedCategory !== 'all') {
      loadCategoryWords(selectedCategory);
    } else if (selectedCategory === 'all') {
      loadAllWords();
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/asl/dictionary/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadCategoryWords = async (category) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/asl/dictionary/category/${category}`);
      setCategoryWords(response.data.words);
      setSearchResults([]);
    } catch (error) {
      console.error('Error loading category words:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllWords = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/asl/dictionary/all?limit=500`);
      // Filter out alphabet and numbers to show mainly common words, animals, fruits, etc.
      const filteredWords = response.data.words.filter(
        word => !['alphabet', 'numbers'].includes(word.category)
      );
      console.log('Total words from API:', response.data.words.length);
      console.log('Filtered words:', filteredWords.length);
      console.log('Sample filtered words:', filteredWords.slice(0, 5));
      setCategoryWords(filteredWords);
      setSearchResults([]);
    } catch (error) {
      console.error('Error loading all words:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/asl/dictionary/search`, {
        params: {
          q: searchQuery,
          category: selectedCategory
        }
      });
      setSearchResults(response.data.results);
      setCategoryWords([]);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const playWordVideo = (word) => {
    setSelectedWord(word);
    setShowVideoModal(true);
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
          Watch Sign
        </button>
      </div>
    </div>
  );

  const VideoModal = () => {
    if (!showVideoModal || !selectedWord) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
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
              <video
                src={selectedWord.video_url.startsWith('http') ? selectedWord.video_url : `${API_URL}${selectedWord.video_url}`}
                controls
                autoPlay
                loop
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>
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
                  const video = document.querySelector('video');
                  if (video) video.currentTime = 0;
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

  const displayWords = searchResults.length > 0 ? searchResults : categoryWords;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">ASL Dictionary</h1>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for words... (e.g., hello, cat, run)"
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

          {/* Categories & View Toggle */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {categories && categories.length > 0 ? (
                categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => {
                      console.log('Clicked category:', cat.name);
                      setSelectedCategory(cat.name);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${
                      selectedCategory === cat.name
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title={`${cat.display_name}: ${cat.count} words`}
                  >
                    {cat.display_name} <span className="text-xs ml-1">({cat.count})</span>
                  </button>
                ))
              ) : (
                <div className="text-gray-500 text-sm">Loading categories...</div>
              )}
            </div>

            <div className="flex items-center gap-2">
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
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
          </div>
        ) : displayWords.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {searchResults.length > 0
                    ? `Search Results (${searchResults.length})`
                    : `${selectedCategory.replace('_', ' ').toUpperCase()} (${displayWords.length} words)`}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Category: {selectedCategory} | Display Words: {displayWords.length} | Category Words: {categoryWords.length}
                </p>
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
        ) : (
          <div className="text-center py-20">
            <BookOpen className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              {searchQuery ? 'No results found' : 'Select a category or search for words'}
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? 'Try searching for different words'
                : 'Start exploring ASL signs by browsing categories or searching'}
            </p>
          </div>
        )}
      </div>

      {/* Video Modal */}
      <VideoModal />
    </div>
  );
};

export default ASLDictionary;
