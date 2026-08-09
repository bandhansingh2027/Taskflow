import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CheckSquare, LayoutDashboard, Users, ListTodo, PlusCircle, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

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
                to="/team"
                className={`nav-link ${isActive('/team') ? 'active' : ''}`}
              >
                <Users size={18} />
                <span>My Team</span>
              </Link>
              <Link
                to="/tasks"
                className={`nav-link ${isActive('/tasks') ? 'active' : ''}`}
              >
                <ListTodo size={18} />
                <span>Tasks</span>
              </Link>
              <Link
                to="/add-task"
                className={`nav-link nav-btn ${isActive('/add-task') ? 'active' : ''}`}
              >
                <PlusCircle size={18} />
                <span>Add Task</span>
              </Link>
            </nav>

            {/* User Profile & Logout */}
            <div className="navbar-user">
              <div className="user-badge" title={user.email}>
                <User size={16} />
                <span className="user-name">{user.name}</span>
              </div>
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
