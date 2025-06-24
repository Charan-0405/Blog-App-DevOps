// src/pages/Home.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
const token = localStorage.getItem('token');
const userId = token ? JSON.parse(atob(token.split('.')[1]))?.userId : null;
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/posts`);
      setPosts(res.data);
    } catch (err) {
      alert('Error fetching posts');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchPosts();
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <h2>All Blog Posts</h2>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map(post => (
          <div key={post._id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p><strong>By:</strong> {post.author?.username || 'Unknown'}</p>

            {post.author?._id === userId && (
              <>
                <button onClick={() => handleEdit(post._id)}>Edit</button>
                <button onClick={() => handleDelete(post._id)} style={{ marginLeft: '10px' }}>Delete</button>
              </>
            )}
            <div style={{ marginTop: '10px' }}>
             <button
  onClick={() =>
    navigate(`/posts/${post._id}/comments`, {
      state: { postAuthorId: post.author._id },
    })
  }
>
  View/Add Comments
</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
