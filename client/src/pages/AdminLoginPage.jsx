import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Line 13: The API call is made here.
      await axios.post('/api/admin/login', { username, password });
      
      // This part only runs if the API call is successful.
      localStorage.setItem('isAdminAuthenticated', 'true');
      navigate('/admin/dashboard');

    } catch (err) {
      // --- THIS PART IS UPDATED FOR BETTER DEBUGGING ---
      
      // Log the full error to the browser's console
      console.error("Login API call failed:", err);

      // Check for a response from the server to get a specific message
      if (err.response) {
        // e.g., 404, 401, 500 errors
        setError(`Login failed: ${err.response.status} ${err.response.statusText}`);
      } else {
        // e.g., Network error, CORS issue
        setError('Login failed: Network error. Is the server running?');
      }
    }
  };

  return (
    <div className="mt-8 flex grow items-center justify-around">
      <div className="mb-32">
        <h1 className="text-4xl text-center mb-4">Admin Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="primary mt-2">Login</button>
          {error && <div className="text-red-500 text-center mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;