import { useState, useEffect, useMemo } from 'react';
import { practiceAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';

export default function Flashcards() {
  type Flashcard = { word: string; image: string };

  const navigate = useNavigate();
  const { language } = useLanguage();
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardCount, setCardCount] = useState(0);
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([]);

  // ISL flashcards data - dynamically load all images from folders
  const islFlashcards = useMemo<Flashcard[]>(() => {
    const images = import.meta.glob('/src/dataset/Frames_Word_Level/**/*.{jpg,jpeg,png}', {
      eager: true,
      as: 'url'
    }) as Record<string, string>;

    const byFolder: Record<string, string[]> = {};
    Object.entries(images).forEach(([path, url]) => {
      const parts = path.split('/');
      const folderIndex = parts.findIndex(p => p === 'Frames_Word_Level');
      if (folderIndex !== -1 && parts[folderIndex + 1]) {
        const folder = parts[folderIndex + 1];
        if (!byFolder[folder]) byFolder[folder] = [];
        byFolder[folder].push(url);
      }
    });

    return Object.entries(byFolder)
      .filter(([_, images]) => images.length > 0)
      .map(([folder, images]) => {
        const randomIndex = Math.floor(Math.random() * images.length);
        return {
          word: folder.replace(/_/g, ' ').toUpperCase(),
          image: images[randomIndex]
        };
      });
  }, []);

  const aslFlashcards = useMemo<Flashcard[]>(() => {
    const images = import.meta.glob('../train/**/*.{jpg,jpeg,png}', {
      eager: true,
      import: 'default'
    }) as Record<string, string>;

    const byFolder: Record<string, string[]> = {};
    Object.entries(images).forEach(([path, url]) => {
      const parts = path.split('/');
      const folder = parts[parts.length - 2];
      if (!byFolder[folder]) byFolder[folder] = [];
      byFolder[folder].push(url);
    });

    const letterOrder = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const numberOrder = '0123456789'.split('');
    const order = [...letterOrder, ...numberOrder];

    return order
      .filter((folder) => byFolder[folder] && byFolder[folder].length > 0)
      .map((folder) => ({
        word: folder.toUpperCase(),
        image: byFolder[folder][0]
      }));
  }, []);

  const flashcards = language === 'ASL' ? aslFlashcards : islFlashcards;

  // Shuffle function
  const shuffleArray = (array: Flashcard[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    setShuffledCards(shuffleArray(flashcards));
    setCardCount(0);
    setIsFlipped(false);
    setCurrentCard(null);
  }, [language]);

  useEffect(() => {
    loadCard();
  }, [cardCount, shuffledCards]);

  const loadCard = () => {
    if (cardCount < shuffledCards.length && shuffledCards.length > 0) {
      setCurrentCard(shuffledCards[cardCount]);
      setIsFlipped(false);
    }
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  // Track completion
  const [completed, setCompleted] = useState(false);

  const handleNext = async () => {
    if (cardCount >= shuffledCards.length - 1) {
      // Submit a practice session when flashcards are completed
      if (!completed) {
        try {
          // Example: score is always 100 for demo, you can make this dynamic
          const data = {
            letter: currentCard?.word || 'N/A',
            strokes: [currentCard?.word || 'N/A'], // Placeholder, update as needed
            language,
          };
          await practiceAPI.submitPractice(data);
          setCompleted(true);
          alert('Flashcards session submitted!');
        } catch (err) {
          alert('Failed to submit flashcards session.');
        }
      }
      navigate('/');
    } else {
      setCardCount(cardCount + 1);
    }
  };

  if (flashcards.length === 0) {
    return (
      <div className="flex items-center justify-center safe-h-screen">
        <div className="text-center">
          <p className="text-gray-600">No flashcards found for {language}.</p>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="flex items-center justify-center safe-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="safe-h-screen w-full flex flex-col bg-background-light dark:bg-black-1 relative overflow-hidden">
      <div className="absolute inset-0 z-0 top-glow" />
      <header className="flex flex-col gap-4 px-6 py-4 bg-background-light dark:bg-black-1 relative z-10">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-primary dark:text-white">arrow_back</span>
          </button>
          <h2 className="text-primary dark:text-white text-2xl font-bold">{language} Flashcards</h2>
          <div className="flex items-center justify-center rounded-full h-10 px-4 gap-2 shadow-lg border border-slate-100 dark:border-black-3 dark-gradient">
            <span className="text-primary dark:text-white text-sm font-bold">{cardCount + 1}/{shuffledCards.length}</span>
          </div>
        </div>
        <div><LanguageToggle /></div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 relative z-10">
        <div className="w-full text-center mb-4">
          <h3 className="text-slate-900 dark:text-white text-xl font-bold">What sign is this?</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">Click the card to reveal the answer</p>
        </div>

        <div 
          className="relative w-full max-w-[85vw] max-h-[60vh] aspect-[3/4] cursor-pointer mb-6"
          onClick={handleCardClick}
          style={{ perspective: '1000px' }}
        >
          <div 
            className="relative w-full h-full transition-transform duration-700"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* Front of card - Image */}
            <div 
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg border-2 border-slate-200 dark:border-slate-700 dark-gradient"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <img 
                src={currentCard.image} 
                alt="ISL Sign" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x600/14b8a6/white?text=' + encodeURIComponent(currentCard.word);
                }}
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Tap to reveal
              </div>
            </div>

            {/* Back of card - Word */}
            <div 
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-primary to-primary-dark flex flex-col items-center justify-center border-2 border-slate-200 dark:border-slate-700"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <span className="material-symbols-outlined text-white text-6xl mb-4">sign_language</span>
              <h2 className="text-white text-3xl font-bold text-center px-6">{currentCard.word}</h2>
              <p className="text-white text-opacity-80 text-sm mt-4">Tap to flip back</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleNext}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-bold text-base shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <span>{cardCount < shuffledCards.length - 1 ? 'Next Card' : 'Complete'}</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </main>
    </div>
  );
}
