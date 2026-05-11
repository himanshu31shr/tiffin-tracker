import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { subscribeToUser } from './services/db';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setUserData(null);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribeDb = subscribeToUser(user.uid, (data) => {
        setUserData(data);
        setLoading(false);
      });
      return () => unsubscribeDb();
    }
  }, [user]);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">🍱 Tiffin Tracker</div>
        <Auth user={user} />
      </header>
      
      <main className="main-content">
        {loading ? (
          <div className="loader">Loading...</div>
        ) : (
          user ? (
            <Dashboard userId={user.uid} userData={userData} />
          ) : (
            <div className="welcome-hero">
              <h1>Never lose track of your meals.</h1>
              <p>Simple, beautiful, and automatic tiffin tracking.</p>
            </div>
          )
        )}
      </main>
    </div>
  );
}

export default App;
