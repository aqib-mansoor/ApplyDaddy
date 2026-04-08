import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDocFromServer } from 'firebase/firestore';
import { auth, db, resetFirestore } from './firebase';
import { useAuthStore } from './store/useAuthStore';
import { Toaster, toast } from 'react-hot-toast';

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
    const testConnection = async (retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          // Try a simple getDoc first which might use cache if persistence is on
          // but we really want to test the server connection
          await getDocFromServer(doc(db, 'test', 'connection'));
          console.log("Firestore connection successful.");
          return; // Success
        } catch (error) {
          console.warn(`Firestore connection attempt ${i + 1} failed:`, error);
          if (i === retries - 1) {
            if(error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('unavailable') || error.message.includes('timeout'))) {
              console.error("Firestore Final Error:", error.message);
              toast.error((t) => (
                <div className="flex flex-col gap-2">
                  <p>Firestore is having trouble connecting. Daddy is trying his best, but the backend is unreachable right now.</p>
                  <button 
                    onClick={() => {
                      toast.dismiss(t.id);
                      resetFirestore();
                    }}
                    className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg text-xs transition-colors self-start"
                  >
                    Reset Connection
                  </button>
                </div>
              ), {
                duration: 15000,
                id: 'firestore-offline-error'
              });
            }
          }
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
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
