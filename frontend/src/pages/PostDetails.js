import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { useParams, useLocation } from 'react-router-dom';

function PostDetails() {
  const { id } = useParams(); // post ID
  const location = useLocation();
  const postAuthorIdFromNav = location.state?.postAuthorId;

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setLoggedInUserId(payload.userId); // set user ID from token
      } catch (err) {
        console.error('❌ Token decoding failed:', err.message);
      }
    }
    fetchPost();
    fetchComments();
  }, []);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      alert('Error fetching post details');
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      alert('Error fetching comments');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/comments`, {
        postId: id,
        content: newComment,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewComment('');
      fetchComments();
    } catch (err) {
      alert('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments();
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <p><strong>Author:</strong> {post.author?.username}</p>

      <hr />

      <h3>Comments</h3>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map(c => (
          <div key={c._id} style={{ borderBottom: '1px solid #ccc', padding: '5px 0' }}>
            <p>{c.content}</p>
            <small>By: {c.author?.username}</small>

            {(c.author._id === loggedInUserId || post.author?._id === loggedInUserId) && (
              <button
                onClick={() => handleDeleteComment(c._id)}
                style={{ marginLeft: '10px', color: 'red' }}
              >
                Delete
              </button>
            )}
          </div>
        ))
      )}

      {token && (
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            rows="3"
            required
          />
          <br />
          <button type="submit">Add Comment</button>
        </form>
      )}
    </div>
  );
}

export default PostDetails;
