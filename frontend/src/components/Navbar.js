import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
      {token && (
        <>
          <Link to="/create" style={{ marginRight: '15px' }}>Create Post</Link>
          <Link to="/profile" style={{ marginRight: '15px' }}>Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
      {!token && (
        <>
          <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
