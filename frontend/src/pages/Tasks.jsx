import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import TaskCard from '../components/TaskCard';
import {
  Search,
  Filter,
  PlusCircle,
  ListTodo,
  AlertCircle,
  RotateCcw
} from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (statusFilter !== 'All') params.status = statusFilter;
      if (priorityFilter !== 'All') params.priority = priorityFilter;

      const response = await API.get('/tasks', { params });
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, priorityFilter]);

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task.');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await API.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(
        tasks.map((task) => (task._id === taskId ? res.data : task))
      );
    } catch (err) {
      console.error('Error updating task status:', err);
      alert('Failed to update task status.');
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setPriorityFilter('All');
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Team Tasks</h1>
          <p>Search, filter, and assign team tasks effectively.</p>
        </div>
        <Link to="/add-task" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Add New Task</span>
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="filter-bar">
        {/* Search input */}
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="filters-group">
          <div className="filter-item">
            <Filter size={16} className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="filter-item">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>

          {(searchTerm || statusFilter !== 'All' || priorityFilter !== 'All') && (
            <button
              onClick={handleResetFilters}
              className="btn btn-secondary btn-sm"
              title="Reset Filters"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Task List / Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Fetching team tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <ListTodo size={40} />
          </div>
          <h3>No tasks found</h3>
          <p>
            {searchTerm || statusFilter !== 'All' || priorityFilter !== 'All'
              ? 'No tasks match your current filters. Try resetting your search.'
              : 'Your team has no active tasks. Add a new task to get started!'}
          </p>
          {searchTerm || statusFilter !== 'All' || priorityFilter !== 'All' ? (
            <button onClick={handleResetFilters} className="btn btn-secondary">
              Clear Filters
            </button>
          ) : (
            <Link to="/add-task" className="btn btn-primary">
              <PlusCircle size={18} />
              <span>Add Task</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="task-grid">
          {tasks.map((task) => (
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

export default Tasks;
