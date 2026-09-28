import React, { createContext, useState, useEffect } from 'react';
import { initialTasks, initialTeam, initialNotifications, defaultUser } from '../demo/demoData';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  // 1. Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('taskflow_demo_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('taskflow_demo_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 2. Tasks State
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('taskflow_demo_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  useEffect(() => {
    localStorage.setItem('taskflow_demo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // 3. Team State
  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem('taskflow_demo_team');
    return saved ? JSON.parse(saved) : initialTeam;
  });

  useEffect(() => {
    localStorage.setItem('taskflow_demo_team', JSON.stringify(team));
  }, [team]);

  // 4. Notifications State
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('taskflow_demo_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  useEffect(() => {
    localStorage.setItem('taskflow_demo_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // 5. User Profile State
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('taskflow_demo_profile');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  useEffect(() => {
    localStorage.setItem('taskflow_demo_profile', JSON.stringify(profile));
  }, [profile]);

  // Task Operations
  const addTask = (taskData) => {
    const newTask = {
      _id: `task_demo_${Date.now()}`,
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'To Do',
      priority: taskData.priority || 'Medium',
      assignedTo: typeof taskData.assignedTo === 'object' 
        ? taskData.assignedTo 
        : team.members.find(m => m._id === taskData.assignedTo) || { name: profile.name, email: profile.email },
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0]
    };

    setTasks((prev) => [newTask, ...prev]);

    // Add a notification for task creation
    const newNotif = {
      id: `notif_${Date.now()}`,
      title: 'New Task Created',
      message: `Task "${newTask.title}" was added to the workspace.`,
      time: 'Just now',
      read: false,
      type: 'info'
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newTask;
  };

  const updateTask = (taskId, updatedData) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t._id === taskId) {
          const updatedAssigned = typeof updatedData.assignedTo === 'object'
            ? updatedData.assignedTo
            : team.members.find(m => m._id === updatedData.assignedTo) || t.assignedTo;
          return {
            ...t,
            ...updatedData,
            assignedTo: updatedAssigned
          };
        }
        return t;
      })
    );
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  // Team Operations
  const createTeam = (name, description) => {
    const newTeam = {
      _id: `team_${Date.now()}`,
      name,
      description,
      members: [
        { _id: profile._id || 'user_demo_101', name: profile.name, email: profile.email, role: profile.role || 'Team Lead', avatar: 'DU', status: 'Online' }
      ]
    };
    setTeam(newTeam);
  };

  const addTeamMember = (email, name = '', role = 'Team Member') => {
    const memberName = name || email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const initials = memberName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const newMember = {
      _id: `user_demo_${Date.now()}`,
      name: memberName,
      email,
      role,
      avatar: initials,
      status: 'Online'
    };

    setTeam((prev) => ({
      ...prev,
      members: [...(prev.members || []), newMember]
    }));

    // Add a notification for member added
    const newNotif = {
      id: `notif_${Date.now()}`,
      title: 'New Team Member',
      message: `${memberName} (${email}) joined ${team.name}.`,
      time: 'Just now',
      read: false,
      type: 'success'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const deleteTeamMember = (memberId) => {
    setTeam((prev) => ({
      ...prev,
      members: (prev.members || []).filter((m) => m._id !== memberId)
    }));
  };

  // Notification Operations
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Profile Operations
  const updateProfile = (data) => {
    setProfile((prev) => ({ ...prev, ...data }));
  };

  // Derived Statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const pendingTasks = tasks.filter((t) => t.status === 'To Do' || t.status === 'Pending').length;
  const memberCount = team?.members?.length || 0;
  const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = {
    teamName: team?.name || 'Engineering Core Team',
    teamDescription: team?.description || '',
    total: totalTasks,
    completed: completedTasks,
    inProgress: inProgressTasks,
    pending: pendingTasks,
    memberCount,
    productivity
  };

  return (
    <TaskContext.Provider
      value={{
        theme,
        toggleTheme,
        tasks,
        addTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        team,
        createTeam,
        addTeamMember,
        deleteTeamMember,
        notifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        profile,
        updateProfile,
        stats
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
