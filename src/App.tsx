import React, { useState, useEffect, type JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './pages/AuthForm';
import Dashboard from './pages/Dashboard';
import './App.css';

/**
 * Protects routes by checking for a valid token in localStorage
 * @param children The component to render if authenticated
 */
const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/signin" />;
};

/**
 * Main application component with routing and Google OAuth callback handling
 */
export default function App() {
  const [isProcessing, setIsProcessing] = useState(true);

  // Handle Google OAuth callback
  useEffect(() => {
    const processQueryParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const user = urlParams.get('user');
      const error = urlParams.get('error');

      if (error) {
        window.history.replaceState({}, document.title, '/signin');
        setIsProcessing(false);
        return;
      }

      if (token && user) {
        try {
          const parsedUser = JSON.parse(decodeURIComponent(user));
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(parsedUser));
          window.history.replaceState({}, document.title, '/dashboard');
        } catch (err) {
          window.history.replaceState({}, document.title, '/signin');
        }
      }
      setIsProcessing(false);
    };

    processQueryParams();
  }, []);

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
