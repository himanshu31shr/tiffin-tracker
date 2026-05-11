import React from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../firebase';

export default function Auth({ user }) {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (user) {
    return (
      <div className="auth-container">
        <div className="user-info">
          <img src={user.photoURL} alt="Profile" className="avatar" />
          <span>{user.displayName}</span>
        </div>
        <button className="btn outline" onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="login-screen">
      <div className="glass-card login-card">
        <h1>Tiffin Tracker</h1>
        <p>Keep track of your daily meals effortlessly.</p>
        <button className="btn primary" onClick={handleLogin}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
