import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import './Home.css';

const CATEGORIES = ['', 'Technology', 'Lifestyle', 'Travel', 'Food', 'Education', 'Other'];

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search.trim()) params.q = search.trim();
      if (category) params.category = category;
      const { data } = await API.get('/posts', { params });
      setPosts(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  return (
    <div className="home">
      <h1>Latest Posts</h1>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((cat) => (
            <option key={cat || 'all'} value={cat}>
              {cat || 'All Categories'}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>
      {loading && <p className="loading">Loading posts...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && posts.length === 0 && <p className="empty">No posts found.</p>}
      <div className="post-grid">
        {posts.map((post) => (
          <article key={post._id} className="post-card">
            <span className="post-category">{post.category}</span>
            <h2>
              <Link to={`/post/${post._id}`}>{post.title}</Link>
            </h2>
            <p className="post-meta">
              By <Link to={`/profile/${post.author._id}`}>{post.author.username}</Link>
              {' · '}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p className="post-excerpt">{stripHtml(post.content).slice(0, 150)}...</p>
            <Link to={`/post/${post._id}`} className="read-more">
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
