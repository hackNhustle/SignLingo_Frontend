import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar3D from './Avatar3D';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import { practiceAPI } from '../services/api';

export default function DailyQuest() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const avatarRef = useRef<any>(null);
  const [quizData, setQuizData] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const response = await practiceAPI.getDailyQuiz(language);
      setQuizData(response.data);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setScore(0);
    } catch (error) {
      console.error('Failed to fetch quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [language]);

  const quiz = quizData[currentQuestion];

  useEffect(() => {
    if (avatarRef.current && quiz) {
      avatarRef.current.performSign(quiz.word);
    }
  }, [currentQuestion, quiz]);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    if (index === quiz.correct) {
      setScore(score + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      navigate('/');
    }
  };

  const handleReplay = () => {
    if (avatarRef.current) {
      avatarRef.current.performSign(quiz.word);
    }
  };

  if (loading || !quiz || !Array.isArray(quizData) || !quiz.options) {
    return (
      <div className="flex safe-h-screen w-full flex-col items-center justify-center max-w-md mx-auto bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">Preparing your quest...</p>
        {!loading && (!Array.isArray(quizData) || !quiz?.options) && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg max-w-xs text-center text-sm">
            Failed to load valid quiz data. Please return home or report this issue.
            <button onClick={() => navigate('/')} className="mt-3 w-full p-2 bg-red-600 text-white rounded hover:bg-red-700">Go Home</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex safe-h-screen w-full flex-col overflow-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark">
      <div className="absolute inset-0 z-0 top-glow" />
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-50">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="confetti" />
          ))}
        </div>
      )}

      <header className="flex items-center px-6 py-3 justify-between pt-6 sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined text-primary dark:text-white">arrow_back</span>
        </button>
        <h2 className="text-primary dark:text-white text-2xl font-extrabold tracking-tight">Today's Quest</h2>
        <div className="flex items-center justify-center rounded-full h-10 px-4 bg-white dark:bg-primary/20 shadow-soft gap-2 border border-primary/10">
          <span className="material-symbols-outlined text-coral icon-filled">local_fire_department</span>
          <span className="text-primary dark:text-white text-sm font-bold">{score}/{quizData.length}</span>
        </div>
      </header>

      <div className="px-6 pb-2 pt-2 relative z-10">
        <LanguageToggle />
      </div>

      <main className="flex-1 flex flex-col items-center justify-start px-3 sm:px-4 pb-24 w-full overflow-y-auto relative z-10">
        <div className="relative w-full flex flex-col items-center justify-center py-3 sm:py-4">
          <div className="absolute w-64 h-64 bg-accent-yellow/40 rounded-full blur-3xl -z-10 animate-pulse" />
          <div className="relative group cursor-pointer transition-transform hover:scale-105 duration-300">
            <div className="w-full max-w-[360px] h-48 sm:h-56 rounded-3xl overflow-hidden bg-gradient-to-b from-transparent to-primary/10 border-4 border-white dark:border-primary/30 shadow-lg flex items-center justify-center relative dark-gradient">
              <Avatar3D ref={avatarRef} />
            </div>
          </div>
          <button
            onClick={handleReplay}
            className="mt-2 sm:mt-3 bg-white dark:bg-primary text-primary dark:text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">replay</span>
            <span className="font-semibold text-xs sm:text-sm">Replay Sign</span>
          </button>
        </div>

        <div className="w-full text-center py-2 sm:py-3 mb-1">
          <h3 className="text-slate-900 dark:text-white text-[22px] sm:text-[28px] font-extrabold leading-tight tracking-tight">What is the sign?</h3>
          <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium mt-1">Select the correct meaning</p>
        </div>

        <div className="w-full grid grid-cols-2 gap-2.5 sm:gap-4 mt-1 sm:mt-2">
          {Array.isArray(quiz.options) ? quiz.options.map((option: string, index: number) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === quiz.correct;
            const showResult = selectedAnswer !== null;

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`relative flex flex-col items-center justify-center p-3 sm:p-6 aspect-[5/4] sm:aspect-[4/3] rounded-2xl border-2 transition-all duration-200 ${showResult && isCorrect
                  ? 'bg-correct text-white border-correct scale-[1.02] ring-4 ring-correct/20 shadow-lg shadow-correct/30'
                  : showResult && isSelected
                    ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/30'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary/30 active:scale-95 shadow-lg dark-gradient'
                  }`}
              >
                {showResult && isCorrect && (
                  <div className="absolute top-2 right-2 bg-white/20 rounded-full p-1">
                    <span className="material-symbols-outlined text-xl font-bold">check</span>
                  </div>
                )}
                {showResult && isSelected && !isCorrect && (
                  <div className="absolute top-2 right-2 bg-white/20 rounded-full p-1">
                    <span className="material-symbols-outlined text-xl font-bold">close</span>
                  </div>
                )}
                <span className={`text-[20px] sm:text-xl font-bold text-center leading-tight ${showResult && (isCorrect || isSelected) ? 'text-zinc-700' : 'text-slate-900 dark:text-white'}`}>
                  {option}
                </span>
              </button>
            );
          }) : null}
        </div>
      </main>

      {selectedAnswer !== null && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark pt-12 pb-8 z-30 pointer-events-none">
          <button
            onClick={handleNext}
            className="w-full flex items-center justify-center h-16 bg-primary hover:bg-primary-dark text-white rounded-full shadow-xl shadow-primary/30 font-bold text-lg tracking-wide transition-all transform hover:scale-[1.02] active:scale-95 pointer-events-auto group"
          >
            <span>{currentQuestion < quizData.length - 1 ? 'Next Quest' : 'Complete'}</span>
            <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      )}

      <style>{`
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          animation: confetti-fall 3s linear forwards;
          opacity: 0;
        }
        @keyframes confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti:nth-child(1) { left: 10%; background-color: #ffd700; animation-delay: 0s; }
        .confetti:nth-child(2) { left: 20%; background-color: #ff6b6b; animation-delay: 0.2s; }
        .confetti:nth-child(3) { left: 30%; background-color: #4ecdc4; animation-delay: 0.4s; }
        .confetti:nth-child(4) { left: 40%; background-color: #45b7d1; animation-delay: 0.1s; }
        .confetti:nth-child(5) { left: 50%; background-color: #96ceb4; animation-delay: 0.3s; }
        .confetti:nth-child(6) { left: 60%; background-color: #ffeead; animation-delay: 0.5s; }
        .confetti:nth-child(7) { left: 70%; background-color: #ffcc5c; animation-delay: 0.2s; }
        .confetti:nth-child(8) { left: 80%; background-color: #ff6f69; animation-delay: 0.4s; }
        .confetti:nth-child(9) { left: 90%; background-color: #88d8b0; animation-delay: 0.1s; }
      `}</style>
    </div>
  );
}
