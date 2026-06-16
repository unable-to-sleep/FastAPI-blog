import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../api'

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API_URL}/posts`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then(data => { setPosts(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  if (loading) return <div className="status">Loading posts...</div>
  if (error) return <div className="status error">Error: {error}</div>

  return (
    <>
      <div className="feed-header">
        <h1>All Posts</h1>
        <p>Thoughts, projects & midnight code</p>
      </div>
      <div className="feed">
        {posts.length === 0 && (
          <div className="empty-state">
            <h3>No posts yet</h3>
            <p>Write something!</p>
          </div>
        )}
        {posts.map(post => (
          <article className="post-card" key={post.id} onClick={() => navigate(`/posts/${post.id}`)}>
            <h2>{post.title}</h2>
            <p className="post-excerpt">{post.content.slice(0, 120)}{post.content.length > 120 ? '...' : ''}</p>
            <div className="post-meta">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
              })}
            </div>
            <span className="read-more">Read more →</span>
          </article>
        ))}
      </div>
    </>
  )
}

export default Home
