import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import {
  Users,
  ListTodo,
  CheckCircle2,
  AlertCircle,
  Clock,
  PlusCircle,
  ArrowRight,
  User,
  Tag
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    teamName: 'Loading...',
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0
  });
  const [teamTasks, setTeamTasks] = useState([]);
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
      setTeamTasks(tasksRes.data);
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

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      fetchDashboardData();
    } catch (err) {
      console.error('Error updating task status:', err);
      alert('Failed to update task status.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="badge badge-completed"><CheckCircle2 size={13} /> Completed</span>;
      case 'In Progress':
        return <span className="badge badge-in-progress"><Clock size={13} /> In Progress</span>;
      case 'To Do':
      case 'Pending':
      default:
        return <span className="badge badge-pending"><AlertCircle size={13} /> To Do</span>;
    }
  };

  return (
    <div className="page-container">
      {/* Team Welcome Banner */}
      <div className="welcome-banner">
        <div className="banner-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Users size={20} className="highlight-text" />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {stats.teamName}
            </span>
          </div>
          <h1>
            Welcome back, <span className="highlight-text">{user?.name}</span> 👋
          </h1>
          <p>Track team progress, tasks, and member assignments in real-time.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/team" className="btn btn-secondary">
            <Users size={18} />
            <span>My Team</span>
          </Link>
          <Link to="/add-task" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Add Task</span>
          </Link>
        </div>
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
            <span className="stat-label">Pending (To Do)</span>
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

      {/* Team Tasks Section */}
      <div className="section-header">
        <div className="section-title">
          <ListTodo size={20} />
          <h2>Team Tasks Overview</h2>
        </div>
        <Link to="/tasks" className="section-link">
          <span>View All Tasks</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Task List Table View: Task Name | Assigned To | Status */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading team tasks...</p>
        </div>
      ) : teamTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <ListTodo size={40} />
          </div>
          <h3>No team tasks found</h3>
          <p>Get started by creating and assigning a task to a team member!</p>
          <Link to="/add-task" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Create Task</span>
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="team-tasks-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Assigned To</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Quick Action</th>
              </tr>
            </thead>
            <tbody>
              {teamTasks.slice(0, 8).map((task) => (
                <tr key={task._id}>
                  <td className="task-name-cell">
                    <span className="task-table-title">{task.title}</span>
                    {task.description && (
                      <span className="task-table-desc">{task.description}</span>
                    )}
                  </td>
                  <td>
                    <div className="assignee-badge">
                      <User size={14} />
                      <span>{task.assignedTo?.name || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`priority-tag priority-${task.priority?.toLowerCase() || 'medium'}`}>
                      {task.priority || 'Medium'}
                    </span>
                  </td>
                  <td>{getStatusBadge(task.status)}</td>
                  <td>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
