import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import TestLogin from './components/TestLogin';
import JobsPage from './pages/JobsPage';
import CoursesPage from './pages/CoursesPage';
import CourseCompletionsPage from './pages/CourseCompletionsPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ViewsPage from './pages/ViewsPage';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('employer');
    setIsAuthenticated(false);
  };

  // Protected Route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />
        } />
        <Route path="/signup" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Signup onLoginSuccess={handleLoginSuccess} />
        } />
        {/* Protected routes with persistent sidebar and top bar layout */}
        <Route element={<ProtectedRoute><Layout onLogout={handleLogout} /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/course-completions" element={<CourseCompletionsPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/views" element={<ViewsPage />} />
        </Route>
        {/* Legacy test route */}
        <Route path="/test-login" element={<TestLogin />} />
        {/* Default redirect */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
};

export default App;