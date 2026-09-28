import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { TaskContext } from '../context/TaskContext';
import {
  Users,
  ListTodo,
  CheckCircle2,
  AlertCircle,
  Clock,
  PlusCircle,
  ArrowRight,
  User,
  Calendar,
  TrendingUp,
  Award
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { tasks, stats, updateTaskStatus, profile } = useContext(TaskContext);

  const handleStatusChange = (taskId, newStatus) => {
    updateTaskStatus(taskId, newStatus);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="badge badge-completed">
            <CheckCircle2 size={13} /> Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="badge badge-in-progress">
            <Clock size={13} /> In Progress
          </span>
        );
      case 'To Do':
      case 'Pending':
      default:
        return (
          <span className="badge badge-pending">
            <AlertCircle size={13} /> To Do
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
            Welcome back, <span className="highlight-text">{profile?.name || user?.name}</span> 👋
          </h1>
          <p>Track team progress, tasks, and productivity metrics in real-time.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/team" className="btn btn-secondary">
            <Users size={18} />
            <span>My Team ({stats.memberCount})</span>
          </Link>
          <Link to="/add-task" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Add Task</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid Cards */}
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

      {/* Productivity Progress Meter */}
      <div className="productivity-card" style={{ marginBottom: '2.5rem' }}>
        <div className="productivity-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="productivity-icon">
              <TrendingUp size={22} />
            </div>
            <div>
              <h3>Workspace Productivity Score</h3>
              <p>Percentage of assigned tasks completed successfully</p>
            </div>
          </div>
          <div className="productivity-score">
            <Award size={20} className="highlight-text" />
            <span>{stats.productivity}% Completed</span>
          </div>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${stats.productivity}%` }}
          />
        </div>
      </div>

      {/* Team Tasks Section */}
      <div className="section-header">
        <div className="section-title">
          <ListTodo size={20} />
          <h2>Team Tasks Overview</h2>
        </div>
        <Link to="/tasks" className="section-link">
          <span>View All ({tasks.length}) Tasks</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <ListTodo size={40} />
          </div>
          <h3>No tasks found</h3>
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
                <th>Task Title</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Quick Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.slice(0, 8).map((task) => (
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
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.85rem',
                        color: task.dueDate ? 'var(--text-secondary)' : 'var(--text-muted)'
                      }}
                    >
                      <Calendar size={13} />
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`priority-tag priority-${
                        task.priority?.toLowerCase() || 'medium'
                      }`}
                    >
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
