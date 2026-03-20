
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import BottomNav from './BottomNav';
import { motion, useInView } from 'motion/react';
import api from '../services/api';
import islDictionaryCsv from '../utils/isl_dictionary.csv?raw';

import aslVideoMapping from '../utils/asl_video_mapping.json';

interface DictionaryEntry {
  word: string;
  videoId?: string;
  videoUrl?: string;
}

const getCloudinaryUrl = (id: string | undefined) =>
  id ? `https://res.cloudinary.com/donbtthvf/video/upload/asl_videos/${id}.mp4` : undefined;

const normalizeWord = (value: string) => value.trim().toLowerCase();

const buildAslMappingLookup = (): Map<string, string> => {
  const lookup = new Map<string, string>();
  const categories = Object.values(aslVideoMapping as Record<string, Record<string, string>>);

  categories.forEach((category) => {
    Object.entries(category || {}).forEach(([word, id]) => {
      lookup.set(normalizeWord(word), id);
    });
  });

  return lookup;
};

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
    async function fetchASLDictionaryStrict() {
      // 1. Try main endpoint
      let words: any[] = [];
      let fetched = false;
      try {
        const res = await api.get('/asl/dictionary/all?limit=2000');
        if (res.data && Array.isArray(res.data.words)) {
          words = res.data.words;
          fetched = true;
        }
      } catch (e) {
        // Fallback to local JSON if API fails
      }
      if (!fetched) {
        // 2. Fallback to local JSON
        words = Object.keys(aslVideoMapping).flatMap((cat) =>
          Object.entries(aslVideoMapping[cat] || {}).map(([word, videoId]) => ({
            word,
            videoId,
            category: cat,
            videoUrl: getCloudinaryUrl(videoId),
            unavailable: !videoId,
          }))
        );
      }
      // 3. Normalize all entries
      const parsed: DictionaryEntry[] = words.map((entry: any) => {
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
      setEntries(parsed);
      setFilteredEntries(parsed);
    }

    async function fetchISLDictionary() {
      try {
        const lines = islDictionaryCsv.split(/\r?\n/);
        const parsed: DictionaryEntry[] = lines
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0)
          .map((line: string) => {
            const lastComma = line.lastIndexOf(',');
            if (lastComma <= 0) return null;

            const word = line.slice(0, lastComma).trim();
            const videoId = line.slice(lastComma + 1).trim();
            if (!word || !videoId) return null;
            if (word.toLowerCase() === 'word' && videoId.toLowerCase() === 'videoid') return null;

            return { word, videoId } as DictionaryEntry;
          })
          .filter((entry): entry is DictionaryEntry => entry !== null);

        setEntries(parsed);
        setFilteredEntries(parsed);
      } catch {
        setEntries([]);
        setFilteredEntries([]);
      }
    }
    if (language === 'ASL') {
      fetchASLDictionaryStrict();
    } else {
      fetchISLDictionary();
    }
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

  if (selectedEntry) {
    console.log('RENDER selectedEntry:', selectedEntry);
  }
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
          {/* selectedEntry debug removed from render */}
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
            {language === 'ASL' ? (
              <ASLVideoPlayer videoUrl={selectedEntry.videoUrl} word={selectedEntry.word} />
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

// Video player with error UI for ASL videos
function ASLVideoPlayer({ videoUrl, word }: { videoUrl?: string, word?: string }) {
  const [error, setError] = useState(false);
  const [diagnostic, setDiagnostic] = useState<string>('');
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



