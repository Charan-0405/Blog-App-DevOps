import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { useNavigate, useParams } from 'react-router-dom';

function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (id) {
      // Editing post: fetch existing data
      axios.get(`${API_BASE_URL}/posts/${id}`)
        .then(res => {
          setTitle(res.data.title);
          setContent(res.data.content);
        })
        .catch(() => alert('Failed to fetch post'));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, content };
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (id) {
        // Update post
        await axios.put(`${API_BASE_URL}/posts/${id}`, payload, config);
        alert('Post updated');
      } else {
        // Create new post
        await axios.post(`${API_BASE_URL}/posts`, payload, config);
        alert('Post created');
      }

      navigate('/');
    } catch (err) {
      alert('Error submitting post');
    }
  };

  return (
    <div>
      <h2>{id ? 'Edit' : 'Create'} Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label><br />
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label><br />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            rows="6"
          />
        </div>
        <button type="submit">{id ? 'Update' : 'Create'} Post</button>
      </form>
    </div>
  );
}

export default PostForm;
