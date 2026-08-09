import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, onDelete, onStatusChange }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="badge badge-completed"><CheckCircle2 size={13} /> Completed</span>;
      case 'In Progress':
        return <span className="badge badge-in-progress"><Clock size={13} /> In Progress</span>;
      case 'Pending':
      default:
        return <span className="badge badge-pending"><AlertCircle size={13} /> Pending</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <span className="priority-tag priority-high">High</span>;
      case 'Medium':
        return <span className="priority-tag priority-medium">Medium</span>;
      case 'Low':
      default:
        return <span className="priority-tag priority-low">Low</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`task-card status-border-${task.status.toLowerCase().replace(' ', '-')}`}>
      <div className="task-card-header">
        <div className="task-badges">
          {getStatusBadge(task.status)}
          {getPriorityBadge(task.priority)}
        </div>
        <div className="task-actions">
          <button
            onClick={() => navigate(`/edit-task/${task._id}`)}
            className="action-btn edit-btn"
            title="Edit Task"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="action-btn delete-btn"
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3 className="task-title">{task.title}</h3>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-card-footer">
        <div className="task-date">
          <Calendar size={14} />
          <span>{formatDate(task.createdAt)}</span>
        </div>

        <div className="status-selector">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            className="status-select"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
