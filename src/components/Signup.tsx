import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      const loginResponse = await authAPI.login({
        username: formData.username,
        password: formData.password
      });
      
      localStorage.setItem('token', loginResponse.data.token);
      localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
      
      setSuccess(true);
      setTimeout(() => navigate('/'), 1000);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="font-display bg-black text-[#111717] antialiased selection:bg-primary/30 safe-h-screen overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary rounded-full filter blur-[120px] opacity-30"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-white rounded-full filter blur-[120px] opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/40 rounded-full filter blur-[100px] opacity-20"></div>
      </div>
      
      {/* Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-3xl bg-black/40"></div>
      
      <div className="relative h-full flex flex-col w-full overflow-x-hidden z-10">
        {/* Header Section */}
        <header className={`relative flex-[0.42] w-full flex flex-col items-center justify-center pt-12 overflow-hidden transition-all duration-700 ${success ? 'flex-1' : ''}`}>
          <div className={`relative z-10 flex flex-col items-center gap-6 px-6 text-center transition-all duration-700 ${success ? 'scale-125' : ''}`}>
            <img 
              src="/logo.png" 
              alt="SignLingo Logo" 
              className="w-20 h-20 object-contain"
            />
            <div className="flex flex-col items-center">
              <h1 className="text-white text-3xl font-bold tracking-tight">SignLingo</h1>
              <p className="text-white/60 text-sm font-medium tracking-widest uppercase mt-1">Learn together</p>
            </div>
          </div>
        </header>

        <main className={`flex-1 rounded-t-[2.5rem] -mt-10 relative z-20 flex flex-col shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 dark-gradient ${success ? 'translate-y-full opacity-0' : 'animate-slide-up-container'}`}>
          <div className="w-full max-w-md mx-auto p-6 pt-8 pb-8 flex flex-col h-full">
            <div className="mb-6 space-y-1">
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
              <p className="text-gray-400 text-sm">Start your signing journey today.</p>
            </div>

            <form className="space-y-5 flex-1" onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary">person</span>
                  </div>
                  <input 
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="block w-full pl-12 pr-5 py-4 bg-black/20 border-transparent rounded-xl text-base text-white placeholder-gray-400 focus:border-primary/50 focus:bg-black/30 focus:ring-4 focus:ring-primary/10 transition-all duration-200" 
                    placeholder="Username" 
                    type="text"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary">mail</span>
                  </div>
                  <input 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-12 pr-5 py-4 bg-black/20 border-transparent rounded-xl text-base text-white placeholder-gray-400 focus:border-primary/50 focus:bg-black/30 focus:ring-4 focus:ring-primary/10 transition-all duration-200" 
                    placeholder="hello@signlingo.com" 
                    type="email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary">lock</span>
                  </div>
                  <input 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-12 pr-12 py-4 bg-black/20 border-transparent rounded-xl text-base text-white placeholder-gray-400 focus:border-primary/50 focus:bg-black/30 focus:ring-4 focus:ring-primary/10 transition-all duration-200" 
                    placeholder="••••••••" 
                    type={showPassword ? 'text' : 'password'}
                    required
                  />
                  <button 
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-200 transition-colors" 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility' : 'visibility_off'}</span>
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="pt-2">
                <button 
                  className="w-full py-4 bg-primary hover:bg-teal-700 text-white font-bold text-lg rounded-full shadow-[0_8px_20px_-6px_rgba(15,117,109,0.4)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>

              
            </form>

            <div className="mt-8 text-center pb-2">
              <p className="text-sm text-gray-400">
                Already have an account? 
                <a onClick={() => navigate('/login')} className="font-bold text-primary h over:text-teal-400 transition-colors ml-1 inline-flex items-center gap-0.5 group cursor-pointer">
                  Log In
                  <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-0.5">chevron_right</span>
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
