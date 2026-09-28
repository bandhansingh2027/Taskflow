import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { TaskContext } from '../context/TaskContext';
import {
  CheckSquare,
  LayoutDashboard,
  Users,
  ListTodo,
  PlusCircle,
  Bell,
  User,
  Settings as SettingsIcon,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme, notifications, profile } = useContext(TaskContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  const unreadNotifs = notifications ? notifications.filter((n) => !n.read).length : 0;

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/dashboard" className="navbar-brand">
          <div className="brand-icon">
            <CheckSquare size={22} />
          </div>
          <span className="brand-title">TaskFlow</span>
        </Link>

        {user && (
          <>
            {/* Navigation Links */}
            <nav className="navbar-nav">
              <Link
                to="/dashboard"
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/tasks"
                className={`nav-link ${isActive('/tasks') ? 'active' : ''}`}
              >
                <ListTodo size={18} />
                <span>Tasks</span>
              </Link>
              <Link
                to="/team"
                className={`nav-link ${isActive('/team') ? 'active' : ''}`}
              >
                <Users size={18} />
                <span>Team</span>
              </Link>
              <Link
                to="/notifications"
                className={`nav-link ${isActive('/notifications') ? 'active' : ''}`}
                style={{ position: 'relative' }}
              >
                <Bell size={18} />
                <span>Notifications</span>
                {unreadNotifs > 0 && (
                  <span className="nav-notif-badge">{unreadNotifs}</span>
                )}
              </Link>
              <Link
                to="/settings"
                className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
              >
                <SettingsIcon size={18} />
                <span>Settings</span>
              </Link>
              <Link
                to="/add-task"
                className={`nav-link nav-btn ${isActive('/add-task') ? 'active' : ''}`}
              >
                <PlusCircle size={18} />
                <span>Add Task</span>
              </Link>
            </nav>

            {/* User Profile, Theme Toggle & Logout */}
            <div className="navbar-user">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="theme-toggle-btn"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <Link to="/profile" className="user-badge" title="View Profile">
                <User size={16} />
                <span className="user-name">{profile?.name || user.name}</span>
              </Link>
              <button onClick={handleLogout} className="btn-logout" title="Logout">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
