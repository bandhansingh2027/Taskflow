import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { PlusCircle, ArrowLeft, AlertCircle, FileText, Tag, Flag } from 'lucide-react';

const AddTask = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [priority, setPriority] = useState('Medium');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      await API.post('/tasks', {
        title: title.trim(),
        description: description.trim(),
        status,
        priority
      });

      navigate('/tasks');
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.response?.data?.message || 'Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container container-narrow">
      <div className="form-header">
        <Link to="/tasks" className="back-link">
          <ArrowLeft size={18} />
          <span>Back to Tasks</span>
        </Link>
        <h1>Create New Task</h1>
        <p>Add a new task to your personal workspace.</p>
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
                placeholder="e.g. Complete Project Proposal"
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
              placeholder="Add details, notes, or subtasks..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Status & Priority Row */}
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
                  <option value="Pending">Pending</option>
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
          </div>

          {/* Actions */}
          <div className="form-actions">
            <Link to="/tasks" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="btn-loading">
                  <span className="spinner-sm"></span> Saving...
                </span>
              ) : (
                <>
                  <PlusCircle size={18} />
                  <span>Create Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
