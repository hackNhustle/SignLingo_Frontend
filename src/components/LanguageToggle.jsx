import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

const LanguageToggle = ({ compact = false }) => {
  const { language, switchLanguage } = useLanguage();

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700 w-fit">
        <button
          onClick={() => switchLanguage('ISL')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            language === 'ISL'
              ? 'bg-primary text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          ISL
        </button>
        <button
          onClick={() => switchLanguage('ASL')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            language === 'ASL'
              ? 'bg-primary text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          ASL
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-white text-xs font-bold tracking-widest uppercase opacity-70">Sign Language</span>
      </div>

      {/* Toggle Switch Style */}
      <div className="flex bg-slate-100 dark:bg-slate-800 rounded-full p-1 shadow-lg border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => switchLanguage('ISL')}
          className={` flex-1 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
            language === 'ISL'
              ? 'bg-primary text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          ISL <span className="text-xs opacity-75">(Indian)</span>
        </button>

        <button
          onClick={() => switchLanguage('ASL')}
          className={`flex-1 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
            language === 'ASL'
              ? 'bg-primary text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          ASL <span className="text-xs opacity-75">(American)</span>
        </button>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-2 text-xs px-2">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          <span className="text-slate-600 dark:text-slate-300">Current:</span>
          <span className="text-slate-900 dark:text-white font-semibold">{language}</span>
        </div>
      </div>
    </div>
  );
};

export default LanguageToggle;
