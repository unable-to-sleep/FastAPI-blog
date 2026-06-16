
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../api'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    const form = new FormData()
    form.append('username', username)
    form.append('password', password)
    try {
      const res = await fetch(`${API_URL}/login`, { method: 'POST', body: form })
      if (!res.ok) throw new Error('Invalid credentials')
      const data = await res.json()
      localStorage.setItem('token', data.access_token)
      onLogin()
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <div className="auth-header">
          <h1>Welcome back</h1>
          <p>Sign in to your account</p>
        </div>
        {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem', fontWeight: 700 }}>{error}</p>}
        <div className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input className="input" placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-submit" onClick={handleSubmit}>Login</button>
        </div>
      </div>
    </div>
  )
}

export default Login
