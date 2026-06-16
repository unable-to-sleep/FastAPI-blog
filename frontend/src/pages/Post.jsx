
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API_URL from '../api'

function Post() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/posts/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Post not found')
        return res.json()
      })
      .then(data => { setPost(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [id])

  if (loading) return <div className="status">Loading...</div>
  if (error) return <div className="status error">{error}</div>

  return (
    <div className="card">
      <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
      <div className="article-header">
        <h1>{post.title}</h1>
        <div className="article-meta">
          {new Date(post.created_at).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
          })}
        </div>
      </div>
      <p className="article-body">{post.content}</p>
    </div>
  )
}

export default Post
