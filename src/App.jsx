import Dashboard from './components/Dashboard'
import Translator from './components/Translator'
import SignToWord from './components/SignToWord'
import UserProfile from './components/UserProfile'
import Login from './components/Login'
import Signup from './components/Signup'
import Practice from './components/Practice'
import TracingPad from './components/TracingPad'
import DailyQuest from './components/DailyQuest'
import Dictionary from './components/Dictionary'
import ASLDictionary from './components/ASLDictionary'
import ASLDictionaryTest from './components/ASLDictionaryTest'
import Flashcards from './components/Flashcards'
import Lessons from './components/Lessons'
import ConnectionTest from './components/ConnectionTest'
import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { LanguageProvider } from './context/LanguageContext.jsx'
import './index.css'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

  return (
    <LanguageProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/translate" element={<Translator />} />
        <Route path="/sign-to-word" element={<SignToWord />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/alphabet/:character" element={<Practice />} />
        <Route path="/tracing" element={<TracingPad />} />
        <Route path="/daily-quest" element={<DailyQuest />} />
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/asl-dictionary" element={<ASLDictionary />} />
        <Route path="/asl-test" element={<ASLDictionaryTest />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/profile" element={<UserProfile darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/stats" element={<Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/test-connection" element={<ConnectionTest />} />
      </Routes>
    </LanguageProvider>
  )
}

export default App
