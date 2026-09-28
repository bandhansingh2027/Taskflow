import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import {
  Search,
  Filter,
  PlusCircle,
  ListTodo,
  RotateCcw
} from 'lucide-react';

const Tasks = () => {
  const { tasks, deleteTask, updateTaskStatus } = useContext(TaskContext);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    updateTaskStatus(taskId, newStatus);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setPriorityFilter('All');
  };

  // Filter tasks locally in memory
  const filteredTasks = tasks.filter((task) => {
    // Search matching
    const matchesSearch =
      !searchTerm.trim() ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status matching
    const matchesStatus =
      statusFilter === 'All' ||
      task.status === statusFilter ||
      (statusFilter === 'To Do' && task.status === 'Pending') ||
      (statusFilter === 'Pending' && task.status === 'To Do');

    // Priority matching
    const matchesPriority =
      priorityFilter === 'All' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Team Tasks ({tasks.length})</h1>
          <p>Search, filter, edit, and assign team tasks effectively.</p>
        </div>
        <Link to="/add-task" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Add New Task</span>
        </Link>
      </div>

      {/* Filter Bar */}
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

      {/* Task Grid */}
      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <ListTodo size={40} />
          </div>
          <h3>No tasks found</h3>
          <p>
            {searchTerm || statusFilter !== 'All' || priorityFilter !== 'All'
              ? 'No tasks match your current filters. Try resetting your search.'
              : 'Your workspace has no active tasks. Add a new task to get started!'}
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
          {filteredTasks.map((task) => (
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
