import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import BottomNav from './BottomNav';
import { motion, useInView } from 'motion/react';
import { learningAPI } from '../services/api';

const API_URL = 'http://localhost:5002/api/v1';

interface DictionaryEntry {
  word: string;
  videoId?: string;
  videoUrl?: string;
}

export default function Dictionary() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<DictionaryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    if (language === 'ASL') {
      learningAPI.getAlphabetList()
        .then(res => {
          const data = res.data;
          const parsed: DictionaryEntry[] = (data.alphabet || [])
            .map((entry: any) => {
              return {
                word: entry.character,
                // Video URL will be fetched on selection or if provided in list
                videoUrl: entry.asl_video_url
              };
            });

          setEntries(parsed);
          setFilteredEntries(parsed);
        })
        .catch(() => {
          setEntries([]);
          setFilteredEntries([]);
        });
      return;
    }

    const dictionaryPath = '/src/utils/isl_dictionary.csv';

    fetch(dictionaryPath)
      .then(res => res.text())
      .then(data => {
        const lines = data.split(/\r?\n/);
        const parsed: DictionaryEntry[] = lines
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
              return { word, videoId } as DictionaryEntry;
            }
            return null;
          })
          .filter((entry): entry is DictionaryEntry => entry !== null && !!entry.word && (!!entry.videoId || !!entry.videoUrl));

        setEntries(parsed);
        setFilteredEntries(parsed);
      })
      .catch(() => {
        setEntries([]);
        setFilteredEntries([]);
      });
  }, [language]);

  useEffect(() => {
    let filtered = entries;

    if (selectedLetter !== 'ALL') {
      filtered = filtered.filter(e => e.word.toUpperCase().startsWith(selectedLetter));
    }

    if (searchQuery) {
      filtered = filtered.filter(e =>
        e.word.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEntries(filtered);
  }, [searchQuery, selectedLetter, entries]);

  return (
    <div className="w-full max-w-md bg-background-light dark:bg-background-dark relative flex flex-col safe-h-screen overflow-hidden">
      <header className="flex flex-col gap-3 px-6 py-3 sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-primary dark:text-white">arrow_back</span>
          </button>
          <h2 className="text-primary dark:text-white text-2xl font-extrabold tracking-tight">{language} Dictionary</h2>
          <div className="w-10" />
        </div>
        <div><LanguageToggle /></div>
      </header>

      {selectedEntry ? (
        <div className="flex-1 flex flex-col p-4 overflow-y-auto pb-28">
          <button onClick={() => setSelectedEntry(null)} className="flex items-center gap-2 text-primary dark:text-white mb-3">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-semibold">Back to list</span>
          </button>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 capitalize">{selectedEntry.word}</h3>
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
            {language === 'ASL' ? (
              <video
                src={selectedEntry.videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedEntry.videoId}`}
                title={selectedEntry.word}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="p-4 space-y-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                type="text"
                placeholder="Search words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
              <button
                onClick={() => setSelectedLetter('ALL')}
                className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-colors ${selectedLetter === 'ALL' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
              >
                All
              </button>
              {alphabet.map(letter => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  className={`px-3 py-2 rounded-full font-semibold text-sm transition-colors ${selectedLetter === letter ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-28">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{filteredEntries.length} words found</p>
            {filteredEntries.length === 0 ? (
              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                {language === 'ASL'
                  ? 'No entries found for ASL. Check the ASL dictionary API.'
                  : `No entries found for ISL. Add entries to the isl_dictionary.csv file.`}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredEntries.map((entry, idx) => {
                  const AnimatedEntry = () => {
                    const ref = useRef(null);
                    const inView = useInView(ref, { amount: 0.5, once: false });
                    return (
                      <motion.button
                        ref={ref}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        onClick={() => setSelectedEntry(entry)}
                        className="w-full p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors text-left flex items-center justify-between group dark-gradient"
                      >
                        <span className="text-slate-900 dark:text-white font-medium capitalize">{entry.word}</span>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">play_circle</span>
                      </motion.button>
                    );
                  };
                  return <AnimatedEntry key={idx} />;
                })}
              </div>
            )}
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}
