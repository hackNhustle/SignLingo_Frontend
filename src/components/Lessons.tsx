import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import { practiceAPI, apiHelpers } from '../services/api';
import AnimatedContent from './AnimatedContent';

export default function Lessons() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [selectedSubject, setSelectedSubject] = useState('maths');
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [progress, setProgress] = useState<{ maths: number; science: number }>({ maths: 0, science: 0 });
  const [completedChapters, setCompletedChapters] = useState<{ maths: string[]; science: string[] }>({ maths: [], science: [] });
  const [loading, setLoading] = useState(true);

  // Subjects and chapters data
  const subjects = {
    maths: {
      name: 'Mathematics',
      icon: 'calculate',
      color: 'blue',
      chapters: language === 'ASL' ? [
        { id: 'maths-1', title: 'Maths 1', videoId: 'iJkEkiCqXuA' },
        { id: 'maths-2', title: 'Maths 2', videoId: 'ge91_tGdis4' },
        { id: 'maths-3', title: 'Maths 3', videoId: 'k8Czr05ajwc' },
        { id: 'maths-4', title: 'Maths 4', videoId: 'o2ql677NhCk' },
        { id: 'maths-5', title: 'Maths 5', videoId: 'LmhWX8Yrtvk' }
      ] : [
        { id: 'shapes', title: 'Shapes and Space', videoId: 'BGBS-CFn3YA' },
        { id: 'numbers', title: 'Numbers', videoId: '27kD7WunkHI' },
        { id: 'numbers-b', title: 'Numbers Part B', videoId: 'ejkKO0CauSg' },
        { id: 'addition', title: 'Addition', videoId: '8jywPyKp364' },
        { id: 'addition-b', title: 'Addition Part B', videoId: 'WR6LXNOYwUU' },
        { id: 'addition-c', title: 'Addition Part C', videoId: 'x916cBZzqLQ' },
        { id: 'subtraction', title: 'Subtraction', videoId: 'IAhrwiLCiFI' },
        { id: 'subtraction-b', title: 'Subtraction Part B', videoId: 'K49siiPUjU4' }
      ]
    },
    science: {
      name: 'Science',
      icon: 'science',
      color: 'green',
      chapters: language === 'ASL' ? [
        { id: 'science-1', title: 'Science 1', videoId: 'bsTkkzIq620' },
        { id: 'science-2', title: 'Science 2', videoId: 'zC8vWqTXUwY' },
        { id: 'science-3', title: 'Science 3', videoId: 'i90VEsCYlXo' },
        { id: 'science-4', title: 'Science 4', videoId: 'GnkGHLwwX3o' },
        { id: 'science-5', title: 'Science 5', videoId: 'iNaCQWPJ2jg' },
        { id: 'science-6', title: 'Science 6', videoId: 'oi-eo25RDTk' },
        { id: 'science-7', title: 'Science 7', videoId: 'rcBe43Pxx2k' },
        { id: 'science-8', title: 'Science 8', videoId: 'xnBCxzCZdCE' },
        { id: 'science-9', title: 'Science 9', videoId: 'BXpaPzYA2h8' }
      ] : [
        { id: 'weather', title: 'Weather', videoId: '1oOYUsdBOO4' },
        { id: 'climate', title: 'Climate', videoId: 'w-cFolXQohk' },
        { id: 'wet-climate', title: 'Wet Climate', videoId: '2nt7Ob0fHuc' },
        { id: 'dry-climate', title: 'Dry Climate', videoId: 'GGbMlckEPLM' },
        { id: 'biology', title: 'Biology', videoId: 'n_W_ssOdrd8' },
        { id: 'digestive', title: 'Digestive System', videoId: 'Mnuy4dNPUEU' },
        { id: 'circulatory', title: 'Circulatory System', videoId: '49jbiZOwRI4' }
      ]
    }
  };

  // Load user progress
  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const response = await practiceAPI.getUserProgress();
      const progressData = response.data.progress;
      
      setProgress({
        maths: progressData.maths?.progress_percentage || 0,
        science: progressData.science?.progress_percentage || 0
      });
      
      setCompletedChapters({
        maths: progressData.maths?.completed_chapters || [],
        science: progressData.science?.completed_chapters || []
      });
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark chapter as completed
  const markChapterComplete = async (subjectId: string, chapterId: string) => {
    try {
      await practiceAPI.markChapterComplete({
        subject_id: subjectId,
        chapter_id: chapterId
      });
      
      // Update local state
      setCompletedChapters(prev => ({
        ...prev,
        [subjectId]: [...(prev[subjectId as keyof typeof prev] || []), chapterId]
      }));
      
      // Recalculate progress
      const totalChapters = subjects[subjectId as keyof typeof subjects].chapters.length;
      const completedCount = completedChapters[subjectId as keyof typeof completedChapters].length + 1;
      const newProgress = Math.round((completedCount / totalChapters) * 100);
      
      setProgress(prev => ({
        ...prev,
        [subjectId]: newProgress
      }));
      
    } catch (error) {
      console.error('Failed to mark chapter complete:', error);
    }
  };

  const getYouTubeEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?si=autoplay&rel=0`;
  };

  const isChapterCompleted = (subjectId: string, chapterId: string) => {
    return completedChapters[subjectId as keyof typeof completedChapters]?.includes(chapterId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center safe-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading lessons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="safe-h-screen bg-background-light dark:bg-black-1 overflow-y-auto">
      <div className="absolute inset-0 z-0 top-glow" />
      {/* Header */}
      <header className="bg-white dark:bg-black shadow-lg border-b border-slate-200 dark:border-slate-700 relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-primary dark:text-white">arrow_back</span>
            </button>
            <h1 className="text-2xl font-bold text-primary dark:text-white">{language} Lessons</h1>
            <div className="w-10"></div>
          </div>
          <div><LanguageToggle /></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 relative z-10">
        {!selectedChapter ? (
          <>
            {/* Subject Selection */}
            <AnimatedContent distance={60} delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {Object.entries(subjects).map(([subjectId, subject]) => (
                <div
                  key={subjectId}
                  onClick={() => setSelectedSubject(subjectId)}
                  className={`p-6 rounded-xl cursor-pointer transition-all shadow-lg border-2 dark-gradient ${
                    selectedSubject === subjectId
                      ? 'border-primary' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-full bg-primary">
                      <span className="material-symbols-outlined text-white text-2xl">{subject.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary dark:text-white">{subject.name}</h3>
                      <p className="text-slate-600 dark:text-slate-400">{subject.chapters.length} chapters</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{progress[subjectId as keyof typeof progress]}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all bg-primary"
                        style={{ width: `${progress[subjectId as keyof typeof progress]}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </AnimatedContent>

            {/* Chapters Path - Duolingo Style */}
            <AnimatedContent distance={60} delay={0.2}>
            <div className="relative rounded-xl shadow-lg p-6 overflow-hidden border border-slate-200 dark:border-slate-700 dark-gradient">
              <h2 className="text-xl font-bold text-primary dark:text-white mb-6">
                {subjects[selectedSubject as keyof typeof subjects].name} Chapters
              </h2>
              
              <div className="space-y-4">
                {subjects[selectedSubject as keyof typeof subjects].chapters.map((chapter: any, index: number) => (
                  <div
                    key={chapter.id}
                    onClick={() => setSelectedChapter(chapter)}
                    className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        isChapterCompleted(selectedSubject, chapter.id)
                          ? 'bg-correct'
                          : 'bg-primary'
                      }`}>
                        {isChapterCompleted(selectedSubject, chapter.id) ? (
                          <span className="material-symbols-outlined">check</span>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary dark:text-white">{chapter.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {isChapterCompleted(selectedSubject, chapter.id) ? 'Completed' : 'Not started'}
                        </p>
                      </div>
                    </div>
                    
                    <span className="material-symbols-outlined text-slate-400">play_circle</span>
                  </div>
                ))}
              </div>
            </div>
            </AnimatedContent>
          </>
        ) : (
          /* Video Player */
          <div className="rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 dark-gradient">
            {/* Video Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setSelectedChapter(null)}
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  Back to chapters
                </button>
                
                {!isChapterCompleted(selectedSubject, selectedChapter.id) && (
                  <button
                    onClick={() => markChapterComplete(selectedSubject, selectedChapter.id)}
                    className="px-4 py-2 bg-correct text-white rounded-lg hover:bg-correct/90 transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">check</span>
                    Mark Complete
                  </button>
                )}
              </div>
              
              <h1 className="text-2xl font-bold text-primary dark:text-white mt-4">{selectedChapter.title}</h1>
              <p className="text-slate-600 dark:text-slate-400">{subjects[selectedSubject as keyof typeof subjects].name}</p>
            </div>

            {/* Video Player */}
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={getYouTubeEmbedUrl(selectedChapter.videoId)}
                title={selectedChapter.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Video Footer */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
                    <span className="material-symbols-outlined text-primary">
                      {subjects[selectedSubject as keyof typeof subjects].icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary dark:text-white">Chapter Progress</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {completedChapters[selectedSubject as keyof typeof completedChapters].length} of {subjects[selectedSubject as keyof typeof subjects].chapters.length} completed
                    </p>
                  </div>
                </div>
                
                {isChapterCompleted(selectedSubject, selectedChapter.id) && (
                  <div className="flex items-center gap-2 text-correct">
                    <span className="material-symbols-outlined">check_circle</span>
                    <span className="font-medium">Completed</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}