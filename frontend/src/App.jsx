
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Post from './pages/Post'
import Login from './pages/Login'
import CreatePost from './pages/CreatePost'
import Register from './pages/Register'
import './App.css'

function Header({ isLoggedIn, onLogout, theme, onToggleTheme }) {
  const navigate = useNavigate()
  return (
    <header className="header">
      <div>
        <h1 className="logo" onClick={() => navigate('/')}>BLOG</h1>
        <p className="tagline">thoughts, projects & midnight code</p>
      </div>
      <div className="header-actions">
        <button className="btn" onClick={onToggleTheme} style={{ padding: '8px 12px' }}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        {isLoggedIn ? (
          <>
            <button className="btn" onClick={() => navigate('/create')}>+ New Post</button>
            <button className="btn btn-danger" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="btn" onClick={() => navigate('/login')}>Login</button>
            <button className="btn" onClick={() => navigate('/register')}>Register</button>
          </>
        )}
      </div>
    </header>
  )
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'))
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const handleToggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
  }

  return (
    <BrowserRouter>
      <Header
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<Post />} />
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/register" element={<Register onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/create" element={<CreatePost />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App