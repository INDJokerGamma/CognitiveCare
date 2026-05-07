// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Pages
import Landing from './pages/Landing'; // Import Landing
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MemoryTest from './pages/tests/MemoryTest';
import History from './pages/History';
import AdminDashboard from './pages/AdminDashboard';
import SignUp from './pages/SignUp';
import MathTest from './pages/tests/MathTest';
import MMSETest from './pages/tests/MMSETest';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Sign Up Route */}
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/dashboard" />} />

        {/* Auth Route */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />

        {/* Protected User Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/test/memory" element={
          <ProtectedRoute>
            <MemoryTest />
          </ProtectedRoute>
        } />

        <Route path="/test/math" element={
          <ProtectedRoute>
            <MathTest />
          </ProtectedRoute>
        } />

        <Route path="/test/mmse" element={
          <ProtectedRoute>
            <MMSETest />
          </ProtectedRoute>
        } />

        <Route path="/history" element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;