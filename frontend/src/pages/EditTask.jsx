import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { Save, ArrowLeft, AlertCircle, FileText, Tag, Flag } from 'lucide-react';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [priority, setPriority] = useState('Medium');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await API.get('/tasks');
        const foundTask = response.data.find((t) => t._id === id);

        if (!foundTask) {
          setError('Task not found');
          return;
        }

        setTitle(foundTask.title);
        setDescription(foundTask.description || '');
        setStatus(foundTask.status || 'Pending');
        setPriority(foundTask.priority || 'Medium');
      } catch (err) {
        console.error('Error fetching task details:', err);
        setError('Failed to fetch task details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      await API.put(`/tasks/${id}`, {
        title: title.trim(),
        description: description.trim(),
        status,
        priority
      });

      navigate('/tasks');
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.response?.data?.message || 'Failed to update task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading task details...</p>
      </div>
    );
  }

  return (
    <div className="page-container container-narrow">
      <div className="form-header">
        <Link to="/tasks" className="back-link">
          <ArrowLeft size={18} />
          <span>Back to Tasks</span>
        </Link>
        <h1>Edit Task</h1>
        <p>Update task details, status, or priority level.</p>
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
              <label htmlFor="status">Task Status</label>
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
                  <Save size={18} />
                  <span>Update Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;
