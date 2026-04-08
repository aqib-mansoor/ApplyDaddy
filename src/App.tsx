import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDocFromServer } from 'firebase/firestore';
import { auth, db } from './firebase';
import { useAuthStore } from './store/useAuthStore';
import { Toaster } from 'react-hot-toast';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Generate from './pages/Generate';
import Applications from './pages/Applications';
import Settings from './pages/Settings';

// Components
import Layout from './components/Layout';

const App: React.FC = () => {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. The Firestore client is offline.");
        }
      }
    };
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#2D2D2D',
            color: '#FDF8F0',
            borderRadius: '1rem',
            padding: '1rem 1.5rem',
            fontWeight: 'bold',
          },
          success: {
            iconTheme: {
              primary: '#8BA88F',
              secondary: '#FDF8F0',
            },
          },
          error: {
            iconTheme: {
              primary: '#E07A5F',
              secondary: '#FDF8F0',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
