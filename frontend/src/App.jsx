import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import AddTask from './pages/AddTask';
import EditTask from './pages/EditTask';

function App() {
  const { token } = useContext(AuthContext);

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Default Route */}
          <Route
            path="/"
            element={<Navigate to={token ? '/dashboard' : '/login'} replace />}
          />

          {/* Public Auth Routes */}
          <Route
            path="/login"
            element={token ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={token ? <Navigate to="/dashboard" replace /> : <Register />}
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-task"
            element={
              <ProtectedRoute>
                <AddTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-task/:id"
            element={
              <ProtectedRoute>
                <EditTask />
              </ProtectedRoute>
            }
          />

          {/* Fallback 404 Route */}
          <Route
            path="*"
            element={<Navigate to={token ? '/dashboard' : '/login'} replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
