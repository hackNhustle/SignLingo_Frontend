import { useNavigate, useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Avatar3D from './Avatar3D';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import * as numbers from '../Animations/numbers';
import { practiceAPI } from '../services/api';

export default function Practice() {
  const navigate = useNavigate();
  const { character: urlCharacter } = useParams<{ character?: string }>();
  const { language } = useLanguage();
  const [mode, setMode] = useState('letters');
  const [selectedItem, setSelectedItem] = useState(urlCharacter?.toUpperCase() || 'A');
  const avatarRef = useRef<any>(null);
  // Track completion and submission status
  const [completed, setCompleted] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  // Auto-play the sign when navigated from a daily practice card
  useEffect(() => {
    if (urlCharacter && avatarRef.current) {
      const timer = setTimeout(() => {
        avatarRef.current?.performSign(urlCharacter.toUpperCase());
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [urlCharacter]);

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    if (avatarRef.current) {
      if (mode === 'numbers') {
        const numberMap: any = {
          '1': 'ONE', '2': 'TWO', '3': 'THREE', '4': 'FOUR', '5': 'FIVE',
          '6': 'SIX', '7': 'SEVEN', '8': 'EIGHT', '9': 'NINE', '10': 'TEN'
        };
        avatarRef.current.performSign(numberMap[item]);
      } else {
        avatarRef.current.performSign(item);
      }
    }
  };

  // Submit practice session to backend when user clicks 'Complete Practice'
  const handleCompletePractice = async () => {
    setSubmitStatus('idle');
    setSubmitMessage('');
    try {
      // Example: score is always 100 for demo, you can make this dynamic
      const data = {
        letter: selectedItem,
        character: selectedItem, // Added for backend analytics
        strokes: [selectedItem], // Placeholder, update as needed
        language,
      };
      await practiceAPI.submitPractice(data);
      setCompleted(true);
      setSubmitStatus('success');
      setSubmitMessage('Practice session submitted!');
    } catch (err) {
      setSubmitStatus('error');
      setSubmitMessage('Failed to submit practice session. Check network, login, or backend.');
    }
  };

  const handleReplay = () => {
    handleItemClick(selectedItem);
  };

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const numbersList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const numbersDisplay = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  const items = mode === 'letters' ? letters : numbersDisplay;

  return (
    <div className="bg-background-light dark:bg-black-1 safe-h-screen overflow-hidden flex flex-col">
      <div className="absolute inset-0 z-0 top-glow" />
      {/* Top Section - Avatar Stage */}
      <div className="relative shadow-lg z-20 flex flex-col shrink-0 flex-[0.48] dark-gradient border-b border-slate-200 dark:border-slate-700">

        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-200 dark:border-slate-700">
          <button onClick={() => navigate('/')} className="text-primary dark:text-white flex size-9 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-[22px]">arrow_back_ios_new</span>
          </button>
          <h2 className="text-primary dark:text-white text-base font-bold">Practice Studio</h2>
          <LanguageToggle compact={true} />
        </div>

        {/* Avatar Stage */}
        <div className="flex-1 flex flex-col items-center justify-center relative px-5 min-h-0">

          {/* Letter Display */}
          <div className="mb-2">
            <span className="text-5xl font-black text-primary dark:text-white drop-shadow-lg">{selectedItem}</span>
          </div>

          {/* Avatar Container */}
          <div className="relative w-full flex-1 flex items-center justify-center min-h-0">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl"></div>
            <div className="relative w-full h-full z-10 max-h-[280px]">
              <Avatar3D ref={avatarRef} />
            </div>
          </div>

          {/* Replay Button */}
          <div className="mb-2">
            <button
              onClick={handleReplay}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95 text-sm font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">replay</span>
              Replay
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section - Controls & Grid */}
      <div className="flex-[0.52] flex flex-col bg-background-light dark:bg-black-1 overflow-hidden relative z-10">
        <div className="flex flex-col h-full px-3 pt-4 pb-3">

          {/* Mode Toggle */}
          <div className="flex justify-center w-full mb-3">
            <div className="flex h-9 w-full max-w-xs items-center gap-0.5 rounded-full bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => { setMode('letters'); setSelectedItem('A'); }}
                className={`h-full flex-1 flex items-center justify-center rounded-full transition-all font-semibold text-xs ${mode === 'letters'
                  ? 'bg-primary shadow-lg text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-slate-200'
                  }`}
              >
                A-Z
              </button>
              <button
                onClick={() => { setMode('numbers'); setSelectedItem('1'); }}
                className={`h-full flex-1 flex items-center justify-center rounded-full transition-all font-semibold text-xs ${mode === 'numbers'
                  ? 'bg-primary shadow-lg text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-slate-200'
                  }`}
              >
                1-10
              </button>
            </div>
          </div>

          {/* Grid of Items */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="grid grid-cols-6 gap-2 pr-1">
              {items.map((item) => (
                <button
                  key={item}
                  onClick={() => handleItemClick(item)}
                  className={`aspect-square flex items-center justify-center rounded-lg font-bold text-sm transition-all active:scale-95 ${selectedItem === item
                    ? 'bg-primary text-white shadow-lg shadow-primary/40 scale-105'
                    : 'bg-slate-200 dark:bg-slate-800 text-primary dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 shadow-md border border-slate-200 dark:border-slate-700'
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          {/* Complete Practice Button and Status */}
          <div className="flex flex-col items-center justify-center mt-4 gap-2">
            <button
              onClick={handleCompletePractice}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-bold text-base shadow-lg transition-all transform hover:scale-105 active:scale-95"
              disabled={completed}
            >
              {completed ? 'Practice Submitted' : 'Complete Practice'}
            </button>
            {submitStatus === 'success' && (
              <span className="text-green-700 font-semibold">{submitMessage}</span>
            )}
            {submitStatus === 'error' && (
              <span className="text-red-600 font-semibold">{submitMessage}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
