import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from '../api/axios';
import './Profile.css';

export default function Profile() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/posts/user/${userId}`)
      .then((res) => setPosts(res.data))
      .finally(() => setLoading(false));
  }, [userId]);

  const username = posts[0]?.author?.username || 'User';

  return (
    <div className="profile">
      <h1>{username}&apos;s Posts</h1>
      {loading && <p className="loading">Loading...</p>}
      {!loading && posts.length === 0 && <p>No posts yet.</p>}
      <ul className="profile-posts">
        {posts.map((post) => (
          <li key={post._id}>
            <Link to={`/post/${post._id}`}>{post.title}</Link>
            <span>
              {post.category} · {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
