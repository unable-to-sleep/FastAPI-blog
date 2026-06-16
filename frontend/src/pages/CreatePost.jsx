
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../api'

function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) { setError('Title and content are required'); return }
    setSubmitting(true)
    setError('')
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, content }),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.detail || 'Failed') }
      const post = await res.json()
      navigate(`/posts/${post.id}`)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="card">
      <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
      <div className="editor-header">
        <h1>New Post</h1>
        <p>Write something worth reading</p>
      </div>
      {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem', fontWeight: 700 }}>{error}</p>}
      <div className="editor-form">
        <div className="form-group">
          <label>Title</label>
          <input className="input" placeholder="Post title" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea className="input" placeholder="Write something..." value={content} onChange={e => setContent(e.target.value)} rows={10} />
        </div>
        <div className="form-actions">
          <button className="btn" style={{ background: '#fff' }} onClick={() => navigate('/')}>Cancel</button>
          <button className="btn" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreatePost