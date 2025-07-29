import React, { useState, useEffect, type JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import './App.css';

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/signin" />;
};

function App() {
  const [isProcessing, setIsProcessing] = useState(true);

  // Handle Google OAuth callback
  useEffect(() => {
    const processQueryParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const user = urlParams.get('user');
      const error = urlParams.get('error');

      if (error) {
        console.error('Google auth error:', decodeURIComponent(error));
        window.history.replaceState({}, document.title, '/signin');
        setIsProcessing(false);
        return;
      }

      if (token && user) {
        try {
          const parsedUser = JSON.parse(decodeURIComponent(user));
          console.log('App.tsx - Parsed user:', parsedUser);
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(parsedUser));
          window.history.replaceState({}, document.title, '/dashboard');
        } catch (err) {
          console.error('Error parsing Google auth user data:', err);
          window.history.replaceState({}, document.title, '/signin');
        }
      }
      setIsProcessing(false);
    };

    processQueryParams();
  }, []);

  // Render nothing until query parameters are processed
  if (isProcessing) {
    return null;
  }

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<AuthForm type="sign-up" />} />
        <Route path="/signin" element={<AuthForm type="sign-in" />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;