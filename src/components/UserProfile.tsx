import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BottomNav from './BottomNav';
import { practiceAPI, authAPI } from '../services/api';
import AnimatedContent from './AnimatedContent';

export default function UserProfile({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (value: boolean) => void }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [savingUsername, setSavingUsername] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [signsLanguage, setSignsLanguage] = useState('ISL');
  const [analytics, setAnalytics] = useState<{
    streak: number;
    signs_learned: number;
    signs_list: string[];
    isl_signs?: string[];
    asl_signs?: string[];
    accuracy: number;
    weekly_hours: number;
    weekly_change: number;
    achievements: any[];
    member_since: string;
  }>({
    streak: 12,
    signs_learned: 124,
    signs_list: [],
    accuracy: 92,
    weekly_hours: 3.5,
    weekly_change: 12,
    achievements: [],
    member_since: '2023'
  });
  const [weeklyData, setWeeklyData] = useState<Array<{ day: string; hours: number }>>([]);
  const [userInfo, setUserInfo] = useState({ username: 'Priya', photo_url: null });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const fetchAnalyticsData = async () => {
    console.log('🔍 Starting to fetch analytics data...');
    try {
      setLoading(true);
      setError(null);

      // Fetch user profile
      try {
        console.log('📝 Fetching user profile...');
        const profileResponse = await authAPI.getProfile();
        console.log('✅ Profile response:', profileResponse.data);
        const profileData = profileResponse.data?.user || profileResponse.data;
        if (profileData) {
          setUserInfo(profileData);
        }
      } catch (err) {
        console.error('❌ Error fetching profile:', err);
        setError('Unable to load profile data');
      }

      // Fetch analytics data
      try {
        console.log('📊 Fetching analytics data...');
        const analyticsResponse = await practiceAPI.getUserAnalytics();
        console.log('✅ Analytics response:', analyticsResponse.data);
        if (analyticsResponse.data) {
          setAnalytics(analyticsResponse.data);
        }
      } catch (err) {
        console.error('❌ Error fetching analytics:', err);
        console.log('Using default analytics data');
      }

      // Fetch weekly chart data
      try {
        console.log('📈 Fetching weekly chart data...');
        const weeklyResponse = await practiceAPI.getWeeklyChartData();
        console.log('✅ Weekly data response:', weeklyResponse.data);
        if (weeklyResponse.data?.chart_data) {
          setWeeklyData(weeklyResponse.data.chart_data);
        }
      } catch (err) {
        console.error('❌ Error fetching weekly data:', err);
        console.log('Using default weekly data');
      }
      console.log('✅ All data fetched successfully!');
    } catch (err) {
      console.error('❌ Critical error fetching analytics:', err);
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Calculate SVG path for chart
  const generateChartPath = () => {
    if (weeklyData.length === 0) {
      return 'M0,80 Q35,70 70,50 T140,40 T210,60 T280,30 T350,20';
    }

    const maxHours = Math.max(...weeklyData.map(d => d.hours), 1);
    const points = weeklyData.map((data, index) => {
      const x = (index / (weeklyData.length - 1)) * 350;
      const y = 100 - (data.hours / maxHours) * 70;
      return `${x},${y}`;
    });

    // Create smooth curve
    let path = `M${points[0]}`;
    for (let i = 1; i < points.length; i++) {
      const [x, y] = points[i].split(',');
      path += ` L${x},${y}`;
    }
    return path;
  };

  const chartPath = generateChartPath();
  const lastPoint = weeklyData.length > 0
    ? { x: 350, y: 100 - (weeklyData[weeklyData.length - 1].hours / Math.max(...weeklyData.map(d => d.hours), 1)) * 70 }
    : { x: 350, y: 20 };

  const getUserInitial = () => {
    return (userInfo.username || 'U').charAt(0).toUpperCase();
  };

  const handleEditUsername = () => {
    console.log('🖊️ Edit username clicked');
    setNewUsername(userInfo.username || '');
    setEditingUsername(true);
    setSaveError('');
  };

  const handleCancelEdit = () => {
    setEditingUsername(false);
    setNewUsername('');
    setSaveError('');
  };

  const handleSaveUsername = async () => {
    setSaveError('');
    if (!newUsername.trim()) {
      setSaveError('Username cannot be empty');
      return;
    }

    if (newUsername.trim().length < 3) {
      setSaveError('Username must be at least 3 characters');
      return;
    }

    if (newUsername === userInfo.username) {
      setEditingUsername(false);
      return;
    }

    try {
      setSavingUsername(true);
      const response = await authAPI.updateProfile({ username: newUsername.trim() });

      const updatedUsername =
        response.data?.user?.username ||
        response.data?.username ||
        newUsername.trim();

      setUserInfo({
        ...userInfo,
        username: updatedUsername
      });

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.username = updatedUsername;
        localStorage.setItem('user', JSON.stringify(userData));
      }

      setEditingUsername(false);
      console.log('✅ Username updated successfully');
    } catch (err: any) {
      console.error('❌ Error updating username:', err);
      if (err.response?.status === 409) {
        setSaveError('Username already taken. Please choose another.');
      } else {
        setSaveError('Failed to update username');
      }
    } finally {
      setSavingUsername(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPEG, PNG, GIF, and WebP images are allowed');
      return;
    }

    try {
      setUploadingPhoto(true);

      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64String = event.target?.result as string;

        try {
          const response = await authAPI.uploadProfilePicture({
            image_data: base64String,
            extension: file.type.split('/')[1] || 'png'
          });

          if (response.data?.photo_url) {
            setUserInfo({
              ...userInfo,
              photo_url: response.data.photo_url
            });

            // Update localStorage user data with new photo URL
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              const userData = JSON.parse(storedUser);
              userData.photo_url = response.data.photo_url;
              localStorage.setItem('user', JSON.stringify(userData));
            }

            console.log('✅ Photo uploaded successfully');
          }
        } catch (error) {
          console.error('❌ Error uploading photo:', error);
          alert('Failed to upload photo. Please try again.');
        } finally {
          setUploadingPhoto(false);
          if (e.target) {
            e.target.value = '';
          }
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('❌ Error reading file:', error);
      setUploadingPhoto(false);
      alert('Error reading file. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-black-1 safe-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loader"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-black-1 text-slate-900 dark:text-white font-display antialiased selection:bg-primary selection:text-white pb-32 safe-h-screen overflow-y-auto relative">
      {/* Teal Glow Background */}
      <div className="absolute inset-0 z-0 top-glow" />

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-black-1/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4">
          <button onClick={() => navigate('/')} className="flex items-center justify-center p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-slate-800 dark:text-white" style={{ fontSize: '24px' }}>arrow_back</span>
          </button>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Profile</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center p-2 rounded-full hover:bg-slate-200 dark:hover:bg-black-3 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className="material-symbols-outlined text-slate-800 dark:text-white" style={{ fontSize: '24px' }}>
                {darkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <button
              onClick={handleEditUsername}
              className="flex items-center justify-center p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Edit username"
            >
              <span className="material-symbols-outlined text-slate-800 dark:text-white" style={{ fontSize: '24px' }}>edit</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-8 px-6 pt-2">
        {/* Profile Header */}
        <section className="flex flex-col items-center gap-4">
          <div className="relative group">
            {userInfo.photo_url ? (
              <div className="h-32 w-32 rounded-full p-1 bg-gradient-to-tr from-primary to-emerald-300">
                <div className="h-full w-full rounded-full bg-[rgb(226,255,255)] dark:bg-[rgb(8,8,8,0.96)] border-4 border-white dark:border-black-1 overflow-hidden flex items-center justify-center">
                  <img
                    src={userInfo.photo_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="h-32 w-32 rounded-full p-1 bg-gradient-to-tr from-primary to-emerald-300">
                <div className="h-full w-full rounded-full bg-[rgb(226,255,255)] dark:bg-[rgb(8,8,8,0.96)] border-4 border-white dark:border-black-1 flex items-center justify-center">
                  <span className="text-5xl font-bold text-primary dark:text-emerald-400">
                    {getUserInitial()}
                  </span>
                </div>
              </div>
            )}
            {/* Upload button overlay */}
            <label className="absolute bottom-0 right-0 bg-primary hover:bg-emerald-600 text-white rounded-full p-2.5 cursor-pointer transition-all shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploadingPhoto}
                className="hidden"
              />
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                {uploadingPhoto ? 'hourglass_empty' : 'camera_alt'}
              </span>
            </label>
          </div>
          <div className="text-center space-y-2">
            {editingUsername ? (
              <div className="flex flex-col items-center gap-3 px-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 bg-[rgb(226,255,255)] dark:bg-[rgb(8,8,8,0.96)] rounded-2xl px-4 py-2 shadow-lg border-2 border-primary/20 dark:border-black-3">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="text-2xl font-bold text-primary dark:text-emerald-400 bg-transparent focus:outline-none min-w-[200px] text-center"
                    placeholder="Enter username"
                    autoFocus
                    disabled={savingUsername}
                    maxLength={20}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveUsername}
                    disabled={savingUsername}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-emerald-600 text-white rounded-full transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-md"
                    title="Save"
                  >
                    {savingUsername ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">check</span>
                        <span className="text-sm font-semibold">Save</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={savingUsername}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-400 hover:bg-slate-500 text-white rounded-full transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-md"
                    title="Cancel"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                    <span className="text-sm font-semibold">Cancel</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Min 3 characters, max 20 characters</p>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-3xl font-extrabold text-primary dark:text-emerald-400 tracking-tight">
                  {userInfo.username || 'User'}
                </h2>
                <button
                  onClick={handleEditUsername}
                  className="p-2 hover:bg-primary/10 dark:hover:bg-emerald-400/10 rounded-full transition-all hover:scale-110"
                  title="Edit username"
                >
                  <span className="material-symbols-outlined text-primary dark:text-emerald-400 text-[18px]">edit</span>
                </button>
              </div>
            )}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-emerald-300 text-sm font-semibold">
              <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
              Level {Math.floor(analytics.signs_learned / 10)} Signer
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Member since {analytics.member_since}</p>
          </div>
        </section>

        {/* Stats Bento Box */}
        <AnimatedContent distance={60} delay={0.1}>
          <section className="grid grid-cols-2 gap-4">
            {/* Learning Streak */}
            <div className="col-span-2 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-black-3 flex flex-row items-center justify-between relative overflow-hidden group dark-gradient">
              <div className="flex flex-col gap-2 z-10">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                  <span style={{ color: "rgb(255 152 0 / 71%)" }} className="material-symbols-outlined ">local_fire_department</span>
                  <span>Learning Streak</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{analytics.streak}</span>
                  <span className="text-lg font-bold text-slate-500 dark:text-slate-400">Days</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  {analytics.streak >= 7 ? 'Personal Best!' : 'Keep Going!'}
                </p>
              </div>
              <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-amber-500 dark:text-amber-500 rotate-12 pointer-events-none">local_fire_department</span>
            </div>

            {/* Signs Learned */}
            <div className="col-span-1 p-5 rounded-3xl shadow-lg border border-slate-200 dark:border-black-3 flex flex-col gap-3 dark-gradient">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <span className="material-symbols-outlined">sign_language</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white block">{analytics.signs_learned}</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Signs Learned</span>
              </div>
            </div>

            {/* Accuracy */}
            <div className="col-span-1 p-5 rounded-3xl shadow-lg border border-slate-200 dark:border-black-3 flex flex-col gap-3 dark-gradient">
              <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <span className="material-symbols-outlined">target</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white block">{analytics.accuracy}%</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Accuracy</span>
              </div>
            </div>
          </section>
        </AnimatedContent>

        {/* Learning Progress Chart */}
        <AnimatedContent distance={60} delay={0.2}>
          <section className="p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-black-3 dark-gradient">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Learning Progress</h3>
              <div className="flex gap-1 bg-slate-100 dark:bg-black-3 p-1 rounded-lg">
                <button className="px-3 py-1 rounded-md bg-[rgb(226,255,255)] dark:bg-[rgb(8,8,8,0.96)] shadow-sm text-xs font-bold text-slate-900 dark:text-white">Week</button>
                <button className="px-3 py-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition-colors">Month</button>
              </div>
            </div>
            <div className="flex flex-col gap-1 mb-6">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{analytics.weekly_hours} hrs</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Total this week</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${analytics.weekly_change >= 0
                  ? 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                  : 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
                  }`}>{analytics.weekly_change >= 0 ? '+' : ''}{analytics.weekly_change}%</span>
              </div>
            </div>
            <div className="w-full h-40 relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 350 100">
                <defs>
                  <linearGradient id="gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#0f756d" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0f756d" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`${chartPath} V100 H0 Z`} fill="url(#gradient)" />
                <path d={chartPath} fill="none" stroke="#0f756d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                <circle className="fill-white dark:fill-slate-800" cx={lastPoint.x} cy={lastPoint.y} r="6" stroke="#0f756d" strokeWidth="3" />
              </svg>
            </div>
            <div className="flex justify-between mt-4 text-xs font-medium text-slate-400 dark:text-slate-500">
              {weeklyData.length > 0 ? weeklyData.map((day, i) => (
                <span key={i} className={i === weeklyData.length - 1 ? 'text-primary font-bold' : ''}>
                  {day.day}
                </span>
              )) : (
                <>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span className="text-primary font-bold">Sun</span>
                </>
              )}
            </div>
          </section>
        </AnimatedContent>

        {/* Signs Learned */}
        {((analytics.isl_signs && analytics.isl_signs.length > 0) || (analytics.asl_signs && analytics.asl_signs.length > 0) || (analytics.signs_list && analytics.signs_list.length > 0)) && (
          <AnimatedContent distance={60} delay={0.3}>
            <section>
              <div className="mb-4 px-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Signs Learned
                  </h3>
                  <div className="flex gap-2 bg-slate-100 dark:bg-black-3 p-1 rounded-lg">
                    <button
                      onClick={() => setSignsLanguage('ISL')}
                      className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${signsLanguage === 'ISL'
                        ? 'bg-yellow-500 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                      🇮🇳 ISL
                    </button>
                    <button
                      onClick={() => setSignsLanguage('ASL')}
                      className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${signsLanguage === 'ASL'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                      🇺🇸 ASL
                    </button>
                  </div>
                </div>

                {signsLanguage === 'ISL' ? (
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
                      {(analytics.isl_signs || analytics.signs_list || []).length} signs learned
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(analytics.isl_signs || analytics.signs_list || []).map((sign: string, index: number) => (
                        <div
                          key={index}
                          className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 dark:border-yellow-400 rounded-lg px-3 py-1.5 flex items-center justify-center min-w-[40px] text-center shadow-sm hover:shadow-md transition-all hover:scale-105"
                        >
                          <span className="font-bold text-yellow-700 dark:text-yellow-300 text-sm">
                            {sign}
                          </span>
                        </div>
                      ))}
                      {(analytics.isl_signs || analytics.signs_list || []).length === 0 && (
                        <p className="text-slate-500 dark:text-slate-400 text-sm">No ISL signs learned yet.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
                      {(analytics.asl_signs || []).length} signs learned
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(analytics.asl_signs || []).map((sign, index) => (
                        <div
                          key={index}
                          className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 dark:border-blue-400 rounded-lg px-3 py-1.5 flex items-center justify-center min-w-[40px] text-center shadow-sm hover:shadow-md transition-all hover:scale-105"
                        >
                          <span className="font-bold text-blue-700 dark:text-blue-300 text-sm">
                            {sign}
                          </span>
                        </div>
                      ))}
                      {(analytics.asl_signs || []).length === 0 && (
                        <p className="text-slate-500 dark:text-slate-400 text-sm">No ASL signs learned yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </AnimatedContent>
        )}

        {/* Achievements */}
        <AnimatedContent distance={60} delay={0.4}>
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Achievements</h3>
              <button className="text-primary text-sm font-semibold hover:opacity-80">View all</button>
            </div>
            <div className="flex flex-col gap-3">
              {analytics.achievements && analytics.achievements.length > 0 ? (
                analytics.achievements.map((achievement) => {
                  // Map color names to Tailwind classes
                  const colorClasses: Record<string, string> = {
                    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500',
                    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500',
                    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500',
                    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-500',
                    pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-500',
                    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500',
                    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-500',
                  };
                  const colorClass = colorClasses[achievement.color] || colorClasses.blue;

                  return (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-4 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-black-3 dark-gradient ${!achievement.unlocked ? 'opacity-50' : ''
                        }`}
                    >
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                        <span className="material-symbols-outlined text-2xl">
                          {achievement.icon}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white">{achievement.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{achievement.description}</p>
                      </div>
                      {achievement.unlocked && (
                        <span className="material-symbols-outlined text-slate-300 dark:text-slate-600">chevron_right</span>
                      )}
                    </div>
                  );
                })
              ) : (
                <>
                  <div className="flex items-center gap-4 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-black-3 dark-gradient">
                    <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-amber-600 dark:text-amber-500 text-2xl">speed</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">Fast Learner</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Complete 10 lessons in 1 hour</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-600">lock</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-black-3 dark-gradient">
                    <div className="h-12 w-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-pink-600 dark:text-pink-500 text-2xl">volunteer_activism</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">Community Hero</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Help 5 peers with signs</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-600">lock</span>
                  </div>
                </>
              )}
            </div>
          </section>
        </AnimatedContent>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}


