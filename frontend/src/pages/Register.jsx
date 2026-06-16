
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../api'

function Register({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) { setError('All fields are required'); return }
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.detail || 'Registration failed') }
      const form = new FormData()
      form.append('username', username)
      form.append('password', password)
      const loginRes = await fetch(`${API_URL}/login`, { method: 'POST', body: form })
      const data = await loginRes.json()
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
          <h1>Create account</h1>
          <p>Join and start writing</p>
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
          <button className="btn btn-submit" onClick={handleSubmit}>Create account</button>
          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '14px', color: 'var(--muted)' }}>
            Already have an account?{' '}
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/login')}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
