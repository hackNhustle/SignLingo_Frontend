import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI, practiceAPI } from '../services/api'
import BottomNav from './BottomNav'
import AnimatedContent from './AnimatedContent'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ level: 1, xp: 0, streak: 0, accuracy: 0, lessons: 0 })
  const [dailyTasks, setDailyTasks] = useState<any[]>([])
  const [showAllPractice, setShowAllPractice] = useState(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/login')
          return
        }

        // Parallel fetch for all dashboard data
        const [userProfile, userProgress, userAnalytics, dailyPractice] = await Promise.all([
          authAPI.getProfile(),
          practiceAPI.getUserProgress().catch(() => ({ data: { level: 1, xp: 0, current_streak: 0 } })),
          practiceAPI.getUserAnalytics().catch(() => ({ data: { accuracy: 0, lessons_completed: 0 } })),
          practiceAPI.getDailyPractice().catch(() => ({ data: { tasks: [] } }))
        ])

        setUser(userProfile.data.user || userProfile.data) // Handle both {user: ...} and direct user objects
        setStats({
          level: userProgress.data.level,
          xp: userProgress.data.xp,
          streak: userProgress.data.current_streak,
          accuracy: userAnalytics.data.accuracy,
          lessons: userAnalytics.data.lessons_completed
        })
        setDailyTasks(dailyPractice.data.tasks || [])

        // Save to localStorage for quick loading next time
        localStorage.setItem('user', JSON.stringify(userProfile.data.user || userProfile.data))
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Check if we have cached data
        const savedUser = localStorage.getItem('user')
        if (!savedUser) {
          navigate('/login')
        } else {
          setUser(JSON.parse(savedUser))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [navigate])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const getUserInitial = () => {
    return (user?.username || 'U').charAt(0).toUpperCase();
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="w-full max-w-md bg-background-light dark:bg-black-1 relative flex flex-col h-screen overflow-hidden items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    )
  }
  return (
    <div className="w-full max-w-md bg-background-light dark:bg-black-1 relative flex flex-col safe-h-screen overflow-hidden">
      {/* Main Content Scroll Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-5 pb-28 space-y-5 hide-scrollbar relative z-10">
        {/* Floating Pill Header */}
        <header className="flex items-center justify-between rounded-full p-2 pl-4 pr-2 shadow-md border border-slate-100 dark:border-black-3 sticky top-0 z-20 dark-gradient">
          <div className="flex items-center gap-3">
            {user?.photo_url ? (
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-emerald-300 border-2 border-white dark:border-black-3 shadow-sm flex items-center justify-center overflow-hidden">
                <img
                  src={user.photo_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-emerald-300 border-2 border-white dark:border-black-3 shadow-sm flex items-center justify-center">
                <span className="text-lg font-bold text-white">{getUserInitial()}</span>
              </div>
            )}
            <div>
              <h1 className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                {getGreeting()}, {user?.username || 'User'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ready to learn?</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#FFF1F2] dark:bg-[#FB7185]/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-[#FB7185]/20">
              <span className="material-symbols-outlined text-[#FB7185] text-[18px]">local_fire_department</span>
              <span className="text-[#FB7185] font-bold text-sm">{stats.streak}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Logout"
            >
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 text-[18px]">logout</span>
            </button>
          </div>
        </header>

        {/* Hero 'Active Lesson' Card */}
        {!showAllPractice && (
          <AnimatedContent distance={60} delay={0.1}>
            <section onClick={() => navigate('/lessons')} className="w-full rounded-3xl p-6 shadow-lg border border-slate-100 dark:border-black-3 relative overflow-hidden group cursor-pointer transition-transform active:scale-[0.98] dark-gradient">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex flex-col gap-1">
                  <span className="text-primary font-semibold text-sm tracking-wide uppercase">Learning Progress</span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">Level {stats.level}<br />{stats.xp} XP</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Accuracy: {stats.accuracy}% • Signs: {stats.lessons}</p>
                </div>
                {/* Circular Progress */}
                <div className="relative size-16 flex items-center justify-center">
                  <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
                    <path className="text-primary drop-shadow-md" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${Math.min(100, (stats.xp % 1000) / 10)}, 100`} strokeLinecap="round" strokeWidth="3" />
                  </svg>
                  <span className="absolute text-xs font-bold text-slate-800 dark:text-white">{Math.round((stats.xp % 1000) / 10)}%</span>
                </div>
              </div>
              <button className="w-full bg-slate-900 dark:bg-primary text-white dark:text-slate-900 h-12 rounded-full font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-primary-dark transition-colors relative z-10 shadow-lg shadow-slate-200 dark:shadow-none">
                <span>View All Progress</span>
                <span className="material-symbols-outlined text-sm">school</span>
              </button>
            </section>
          </AnimatedContent>
        )}

        {/* Communication Core (Bento Grid) */}
        {!showAllPractice && (
          <AnimatedContent distance={60} delay={0.2}>
            <section className="grid grid-cols-2 gap-4 min-h-[240px]">
              {/* Text-to-Sign Portal */}
              <div onClick={() => navigate('/translate')} className="bg-primary rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden shadow-glow shadow-primary/20 group cursor-pointer transition-transform active:scale-[0.98]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center dark:text-black text-white relative z-10">
                  <span className="material-symbols-outlined">keyboard</span>
                </div>
                <div className="relative z-10">
                  <h3 className="text-white dark:text-black text-lg font-bold leading-tight mb-1">Text to<br />Sign</h3>
                  <p className="text-white/80 dark:text-black text-xs font-medium">Type to Translate</p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
                  <span className="material-symbols-outlined text-[100px] dark:text-black text-white">waving_hand</span>
                </div>
              </div>

              {/* Sign-to-Text Portal */}
              <div onClick={() => navigate('/sign-to-word')} className="border-2 border-primary/20 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden shadow-lg cursor-pointer transition-all active:scale-[0.98] hover:border-primary/50 dark-gradient">
                <div className="w-12 h-12 bg-slate-50 dark:bg-black-3 rounded-full flex items-center justify-center text-primary relative z-10">
                  <span className="material-symbols-outlined">videocam</span>
                </div>
                <div className="relative z-10">
                  <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight mb-1">Sign to<br />Text</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Scan Hand Signs</p>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-primary/10 rounded-full animate-pulse" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-primary/20 rounded-full" />
              </div>
            </section>
          </AnimatedContent>
        )}

        {/* Tools Heading */}
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daily Practice</h3>
          <button onClick={() => setShowAllPractice(!showAllPractice)} className="text-xs font-semibold text-primary">{showAllPractice ? 'Show Less' : 'View All'}</button>
        </div>

        {/* Horizontal Scroll Tools or Daily Tasks */}
        <div className="animate-fade-in" style={{ animation: 'fadeIn 0.5s ease-out 0.3s both' }}>
          {/* Daily Practice Recommendation Cards */}
          {dailyTasks.length > 0 && (
            <section className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-5 px-5 mb-4">
              {dailyTasks.map((task, i) => (
                <div
                  key={`task-${i}`}
                  onClick={() => navigate(`/alphabet/${task.character}`)}
                  className="min-w-[160px] p-4 rounded-3xl shadow-lg border-2 border-primary/30 bg-white dark:bg-black-3 cursor-pointer active:scale-95 transition-transform"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {task.character}
                    </div>
                    <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md text-[10px] font-bold">
                      +{task.xp_reward} XP
                    </div>
                  </div>
                  <p className="font-bold text-slate-800 dark:text-white text-sm line-clamp-1">{task.title}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Recommended</p>
                </div>
              ))}
            </section>
          )}

          {/* Tool Shortcuts Grid */}
          <section className={showAllPractice ? "grid grid-cols-2 gap-4" : "flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-5 px-5"}>
            {[
              { icon: 'style', title: 'Flashcards', subtitle: 'Review', path: '/flashcards' },
              { icon: 'trophy', title: 'Daily Quiz', subtitle: 'Challenge', path: '/daily-quest' },
              { icon: 'menu_book', title: 'Dictionary', subtitle: 'ISL Library', path: '/dictionary' },
              { icon: 'edit', title: 'Tracing', subtitle: 'Practice Writing', path: '/tracing' },
              { icon: 'sign_language', title: 'Practice', subtitle: 'Learn Signs', path: '/practice' },
            ].map((tool, i) => (
              <div
                key={`tool-${i}`}
                onClick={() => tool.path && navigate(tool.path)}
                className={`${showAllPractice ? 'aspect-square' : 'min-w-[140px] aspect-square'} rounded-3xl p-4 flex flex-col items-center justify-center gap-3 shadow-lg border border-slate-100 dark:border-black-3 text-center relative overflow-hidden dark-gradient cursor-pointer active:scale-95 transition-transform`}
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-white">
                  <span className="material-symbols-outlined">{tool.icon}</span>
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-sm">{tool.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{tool.subtitle}</p>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>

      {/* Floating Glassmorphic Dock */}
      <BottomNav />
    </div>
  );
}
