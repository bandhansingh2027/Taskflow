import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import {
  ListTodo,
  CheckCircle2,
  AlertCircle,
  Clock,
  PlusCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, inProgress: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [statsRes, tasksRes] = await Promise.all([
        API.get('/tasks/stats'),
        API.get('/tasks')
      ]);

      setStats(statsRes.data);
      // Show up to 6 most recent tasks
      setRecentTasks(tasksRes.data.slice(0, 6));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await API.delete(`/tasks/${taskId}`);
      fetchDashboardData();
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task.');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      fetchDashboardData();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update task status.');
    }
  };

  return (
    <div className="page-container">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="banner-content">
          <h1>
            Hello, <span className="highlight-text">{user?.name}</span> 👋
          </h1>
          <p>Here is your task summary and progress for today.</p>
        </div>
        <Link to="/add-task" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>New Task</span>
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon-wrapper">
            <ListTodo size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>

        <div className="stat-card stat-pending">
          <div className="stat-icon-wrapper">
            <AlertCircle size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Pending Tasks</span>
            <span className="stat-value">{stats.pending}</span>
          </div>
        </div>

        <div className="stat-card stat-in-progress">
          <div className="stat-icon-wrapper">
            <Clock size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{stats.inProgress}</span>
          </div>
        </div>

        <div className="stat-card stat-completed">
          <div className="stat-icon-wrapper">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{stats.completed}</span>
          </div>
        </div>
      </div>

      {/* Recent Tasks Header */}
      <div className="section-header">
        <div className="section-title">
          <Sparkles size={20} />
          <h2>Recent Tasks</h2>
        </div>
        <Link to="/tasks" className="section-link">
          <span>View All Tasks</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Recent Task List */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your tasks...</p>
        </div>
      ) : recentTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <ListTodo size={40} />
          </div>
          <h3>No tasks found</h3>
          <p>Get started by creating your very first task!</p>
          <Link to="/add-task" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Create Task</span>
          </Link>
        </div>
      ) : (
        <div className="task-grid">
          {recentTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
