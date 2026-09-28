import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, ArrowLeft, FileText, Tag, Flag, User, Calendar, AlertCircle } from 'lucide-react';

const AddTask = () => {
  const { team, addTask, profile } = useContext(TaskContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [priority, setPriority] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState(
    team?.members?.[0]?._id || user?._id || 'user_demo_101'
  );
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    addTask({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assignedTo,
      dueDate
    });

    navigate('/tasks');
  };

  const membersList = team?.members || [
    { _id: 'user_demo_101', name: profile?.name || user?.name || 'Demo User', email: profile?.email || user?.email || 'demo@taskflow.com' }
  ];

  return (
    <div className="page-container container-narrow">
      <div className="form-header">
        <Link to="/tasks" className="back-link">
          <ArrowLeft size={18} />
          <span>Back to Tasks</span>
        </Link>
        <h1>Create Team Task</h1>
        <p>Add a new task and assign it to a team member.</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <div className="input-with-icon">
              <FileText size={18} className="input-icon" />
              <input
                type="text"
                id="title"
                placeholder="e.g. Implement User Authentication UI"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows={4}
              placeholder="Add details, instructions, or subtasks..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Assigned To */}
          <div className="form-group">
            <label htmlFor="assignedTo">Assign To Team Member</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <select
                id="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                {membersList.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status, Priority & Due Date Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Initial Status</label>
              <div className="input-with-icon">
                <Tag size={18} className="input-icon" />
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority Level</label>
              <div className="input-with-icon">
                <Flag size={18} className="input-icon" />
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <div className="input-with-icon">
                <Calendar size={18} className="input-icon" />
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <Link to="/tasks" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              <PlusCircle size={18} />
              <span>Create Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
