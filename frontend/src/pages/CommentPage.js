import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../utils/constants';

function CommentPage() {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const token = localStorage.getItem('token');
  const tokenPayload = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const loggedInUserId = tokenPayload?.userId;

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      alert('Error fetching comments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE_URL}/comments`,
        { postId, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setContent('');
      fetchComments();
    } catch (err) {
      alert('Failed to add comment');
    }
  };

  const handleEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
  };

  const handleUpdate = async (commentId) => {
    try {
      await axios.put(
        `${API_BASE_URL}/comments/${commentId}`,
        { content: editContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingCommentId(null);
      setEditContent('');
      fetchComments();
    } catch (err) {
      alert('Failed to update comment');
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchComments();
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div>
      <h2>Comments</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          rows="3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          required
        />
        <br />
        <button type="submit">Add Comment</button>
      </form>

      <hr />

      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => {
          const isCommentOwner = comment.author?._id === loggedInUserId;
          const isPostOwner = comment.postId?.author === loggedInUserId;

          return (
            <div
              key={comment._id}
              style={{
                border: '1px solid #ccc',
                margin: '10px 0',
                padding: '8px',
                position: 'relative',
              }}
            >
              {editingCommentId === comment._id ? (
                <>
                  <textarea
                    rows="2"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <br />
                  <button onClick={() => handleUpdate(comment._id)}>Save</button>
                  <button onClick={() => setEditingCommentId(null)} style={{ marginLeft: '5px' }}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p>{comment.content}</p>
                  <p>
                    <strong>By:</strong> {comment.author?.username || 'Unknown'}
                  </p>

                  {(isCommentOwner || isPostOwner) && (
                    <div>
                      {isCommentOwner && (
                        <button onClick={() => handleEdit(comment)}>Edit</button>
                      )}
                      <button onClick={() => handleDelete(comment._id)} style={{ marginLeft: '5px' }}>
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default CommentPage;
