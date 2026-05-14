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

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div className="app-container">
      {user ? (
        <>
          <header className="app-header">
            <div className="logo">🍱 Tiffin Tracker</div>
            <Auth user={user} />
          </header>
          <main className="main-content">
            <Dashboard key={userData?.currentRecharge ? 'active' : 'empty'} userId={user.uid} userData={userData} />
          </main>
        </>
      ) : (
        <Auth user={user} />
      )}
    </div>
  );

}

export default App;
