'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './adminsignin.scss';

const AdminsignIn = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validUsername = 'Admin'; // Replace with your desired username
  const validPassword = 'Admin'; // Replace with your desired password

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === validUsername && password === validPassword) {
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      router.push('/admin'); // Replace with the path to the protected page
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="signin-background">
      <div className="signin-form-container">
        <form className="signin-form" onSubmit={handleSignIn}>
          <div className="signin-field username-box">
            <label className="signin-label">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="signin-input rounded-10"
            />
          </div>  
          <div className="signin-field password-box">
            <label className="signin-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signin-input rounded-10"
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className="signin-button rounded-10 mt-4">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminsignIn;
