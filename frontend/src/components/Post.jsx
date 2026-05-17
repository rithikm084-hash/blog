import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Post.css';

export default function Post() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [postRes, commentsRes] = await Promise.all([
        API.get(`/posts/${id}`),
        API.get(`/comments/post/${id}`),
      ]);
      setPost(postRes.data);
      setComments(commentsRes.data);
    } catch {
      setError('Post not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    await API.delete(`/posts/${id}`);
    navigate('/');
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const { data } = await API.post(`/comments/post/${id}`, { text: commentText });
    setComments([data, ...comments]);
    setCommentText('');
  };

  const isAuthor =
    user && post && String(user.id) === String(post.author._id);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <article className="post-detail">
      <span className="post-category">{post.category}</span>
      <h1>{post.title}</h1>
      <p className="post-meta">
        By <Link to={`/profile/${post.author._id}`}>{post.author.username}</Link>
        {' · '}Published {new Date(post.createdAt).toLocaleString()}
        {post.updatedAt !== post.createdAt && (
          <> · Updated {new Date(post.updatedAt).toLocaleString()}</>
        )}
      </p>
      {isAuthor && (
        <div className="post-actions">
          <Link to={`/edit/${id}`} className="btn btn-outline">
            Edit
          </Link>
          <button type="button" onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      )}
      <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      <section className="comments-section">
        <h2>Comments ({comments.length})</h2>
        {isAuthenticated ? (
          <form onSubmit={handleComment} className="comment-form">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              required
            />
            <button type="submit" className="btn btn-primary">
              Post Comment
            </button>
          </form>
        ) : (
          <p>
            <Link to="/login">Login</Link> to comment.
          </p>
        )}
        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c._id}>
              <strong>{c.author.username}</strong>
              <span>{new Date(c.createdAt).toLocaleString()}</span>
              <p>{c.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
