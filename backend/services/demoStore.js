const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../data');

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const TEAMS_FILE = path.join(DATA_DIR, 'teams.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to read JSON
const readData = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf8');
    return content ? JSON.parse(content) : [];
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return [];
  }
};

// Helper to write JSON
const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err.message);
  }
};

// Seed initial demo data if empty
const seedDemoData = async () => {
  let users = readData(USERS_FILE);
  let teams = readData(TEAMS_FILE);
  let tasks = readData(TASKS_FILE);

  if (users.length === 0) {
    console.log('Seeding initial demo users...');
    const hashedDemoPassword = await bcrypt.hash('demo123', 10);
    const hashedMemberPassword = await bcrypt.hash('password123', 10);

    const demoUser = {
      _id: 'usr_demo_1001',
      name: 'Demo Admin',
      email: 'demo@taskflow.com',
      password: hashedDemoPassword,
      createdAt: new Date().toISOString()
    };
    const aliceUser = {
      _id: 'usr_alice_1002',
      name: 'Alice Johnson',
      email: 'alice@taskflow.com',
      password: hashedMemberPassword,
      createdAt: new Date().toISOString()
    };
    const bobUser = {
      _id: 'usr_bob_1003',
      name: 'Bob Smith',
      email: 'bob@taskflow.com',
      password: hashedMemberPassword,
      createdAt: new Date().toISOString()
    };
    const charlieUser = {
      _id: 'usr_charlie_1004',
      name: 'Charlie Brown',
      email: 'charlie@taskflow.com',
      password: hashedMemberPassword,
      createdAt: new Date().toISOString()
    };

    users = [demoUser, aliceUser, bobUser, charlieUser];
    writeData(USERS_FILE, users);
  }

  const demoUser = users.find((u) => u.email === 'demo@taskflow.com') || users[0];
  const aliceUser = users.find((u) => u.email === 'alice@taskflow.com') || users[1];
  const bobUser = users.find((u) => u.email === 'bob@taskflow.com') || users[2];
  const charlieUser = users.find((u) => u.email === 'charlie@taskflow.com') || users[3];

  if (teams.length === 0) {
    console.log('Seeding initial demo team...');
    const demoTeam = {
      _id: 'team_alpha_2001',
      name: 'Engineering Product Team',
      description: 'Core product dev & UI task workflow management',
      creatorId: demoUser._id,
      members: [demoUser._id, aliceUser._id, bobUser._id, charlieUser._id],
      createdAt: new Date().toISOString()
    };
    teams = [demoTeam];
    writeData(TEAMS_FILE, teams);
  }

  const demoTeam = teams[0];

  if (tasks.length === 0) {
    console.log('Seeding initial demo tasks...');
    const now = new Date();

    const initialTasks = [
      {
        _id: 'task_101',
        userId: demoUser._id,
        teamId: demoTeam._id,
        assignedTo: demoUser._id,
        title: 'Complete System Architecture Review',
        description: 'Review full stack components, environment configs, and deployment scripts.',
        status: 'In Progress',
        priority: 'High',
        dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'task_102',
        userId: demoUser._id,
        teamId: demoTeam._id,
        assignedTo: aliceUser._id,
        title: 'Design UI Theme & Navigation Header',
        description: 'Ensure dark purple glassmorphic aesthetics across navigation bar and dashboard cards.',
        status: 'Completed',
        priority: 'Medium',
        dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'task_103',
        userId: demoUser._id,
        teamId: demoTeam._id,
        assignedTo: bobUser._id,
        title: 'Refactor Authentication & JWT Interceptors',
        description: 'Handle automatic token attachment and clean 401 session expiration handling.',
        status: 'To Do',
        priority: 'High',
        dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'task_104',
        userId: demoUser._id,
        teamId: demoTeam._id,
        assignedTo: charlieUser._id,
        title: 'Optimize Team Member Assignment Flow',
        description: 'Allow adding registered team members by email and assigning active tasks.',
        status: 'In Progress',
        priority: 'Medium',
        dueDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'task_105',
        userId: demoUser._id,
        teamId: demoTeam._id,
        assignedTo: demoUser._id,
        title: 'Set Up Local JSON Demo Data Store',
        description: 'Ensure application operates seamlessly in offline presentation demo mode.',
        status: 'Completed',
        priority: 'Low',
        dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'task_106',
        userId: demoUser._id,
        teamId: demoTeam._id,
        assignedTo: aliceUser._id,
        title: 'Conduct Performance Audit on Dashboard Charts',
        description: 'Verify statistic counter animations and task list rendering speed.',
        status: 'To Do',
        priority: 'Medium',
        dueDate: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'task_107',
        userId: demoUser._id,
        teamId: demoTeam._id,
        assignedTo: bobUser._id,
        title: 'Prepare Final Live Demo Presentation',
        description: 'Test register, login, add task, edit status, team view, and data persistence.',
        status: 'To Do',
        priority: 'High',
        dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'task_108',
        userId: demoUser._id,
        teamId: demoTeam._id,
        assignedTo: charlieUser._id,
        title: 'Update API Documentation & Endpoint List',
        description: 'Ensure Swagger/Postman docs reflect exact JSON payload shapes.',
        status: 'Completed',
        priority: 'Low',
        dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    tasks = initialTasks;
    writeData(TASKS_FILE, tasks);
  }
};

// Initialize seed data on module load
seedDemoData().catch((err) => console.error('Seed demo data error:', err));

// Demo Operations API
const demoStore = {
  // Users
  getUsers: () => readData(USERS_FILE),
  findUserByEmail: (email) => {
    if (!email) return null;
    const users = readData(USERS_FILE);
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },
  findUserById: (id) => {
    if (!id) return null;
    const users = readData(USERS_FILE);
    const u = users.find((u) => String(u._id) === String(id));
    if (!u) return null;
    const { password, ...userWithoutPassword } = u;
    return userWithoutPassword;
  },
  createUser: async (name, email, password) => {
    const users = readData(USERS_FILE);
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) throw new Error('User already exists with this email');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      _id: 'usr_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    writeData(USERS_FILE, users);
    return newUser;
  },

  // Teams
  getTeams: () => readData(TEAMS_FILE),
  getUserTeam: (userId) => {
    const teams = readData(TEAMS_FILE);
    const team = teams.find(
      (t) =>
        String(t.creatorId) === String(userId) ||
        (Array.isArray(t.members) && t.members.some((m) => String(m) === String(userId)))
    );
    if (!team) return null;

    // Populate members
    const users = readData(USERS_FILE);
    const populatedMembers = (team.members || [])
      .map((mId) => users.find((u) => String(u._id) === String(mId)))
      .filter(Boolean)
      .map(({ password, ...uObj }) => uObj);

    return {
      ...team,
      members: populatedMembers
    };
  },
  createTeam: (name, description, creatorId) => {
    const teams = readData(TEAMS_FILE);
    const existing = teams.find(
      (t) =>
        String(t.creatorId) === String(creatorId) ||
        (Array.isArray(t.members) && t.members.some((m) => String(m) === String(creatorId)))
    );
    if (existing) {
      throw new Error('You already belong to a team');
    }

    const newTeam = {
      _id: 'team_' + Date.now(),
      name: name.trim(),
      description: description ? description.trim() : '',
      creatorId: creatorId,
      members: [creatorId],
      createdAt: new Date().toISOString()
    };

    teams.push(newTeam);
    writeData(TEAMS_FILE, teams);
    return demoStore.getUserTeam(creatorId);
  },
  addTeamMember: (teamId, email, requestingUserId) => {
    const teams = readData(TEAMS_FILE);
    const team = teams.find((t) => String(t._id) === String(teamId));
    if (!team) throw new Error('Team not found');

    const users = readData(USERS_FILE);
    const userToAdd = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!userToAdd) throw new Error('No registered user found with this email');

    if (team.members.some((m) => String(m) === String(userToAdd._id))) {
      throw new Error('User is already a member of this team');
    }

    team.members.push(userToAdd._id);
    writeData(TEAMS_FILE, teams);
    return demoStore.getUserTeam(requestingUserId);
  },

  // Tasks
  getTasks: (userId, filters = {}) => {
    const tasks = readData(TASKS_FILE);
    const team = demoStore.getUserTeam(userId);
    const teamId = team ? team._id : null;

    let userTasks = tasks.filter((t) => {
      if (teamId) return String(t.teamId) === String(teamId);
      return String(t.userId) === String(userId) || String(t.assignedTo) === String(userId);
    });

    const { status, priority, search } = filters;

    if (status && status !== 'All') {
      if (status === 'Pending' || status === 'To Do') {
        userTasks = userTasks.filter((t) => t.status === 'To Do' || t.status === 'Pending');
      } else {
        userTasks = userTasks.filter((t) => t.status === status);
      }
    }

    if (priority && priority !== 'All') {
      userTasks = userTasks.filter((t) => t.priority === priority);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      userTasks = userTasks.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Populate assignedTo & userId
    const users = readData(USERS_FILE);
    const populated = userTasks.map((t) => {
      const assignedObj = users.find((u) => String(u._id) === String(t.assignedTo));
      const creatorObj = users.find((u) => String(u._id) === String(t.userId));

      return {
        ...t,
        status: t.status === 'Pending' ? 'To Do' : t.status,
        assignedTo: assignedObj ? { _id: assignedObj._id, name: assignedObj.name, email: assignedObj.email } : null,
        userId: creatorObj ? { _id: creatorObj._id, name: creatorObj.name, email: creatorObj.email } : null
      };
    });

    return populated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  createTask: (userId, taskData) => {
    const tasks = readData(TASKS_FILE);
    const team = demoStore.getUserTeam(userId);

    const newTask = {
      _id: 'task_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      userId,
      teamId: team ? team._id : null,
      assignedTo: taskData.assignedTo || userId,
      title: taskData.title.trim(),
      description: taskData.description ? taskData.description.trim() : '',
      status: taskData.status === 'Pending' || !taskData.status ? 'To Do' : taskData.status,
      priority: taskData.priority || 'Medium',
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    writeData(TASKS_FILE, tasks);

    const users = readData(USERS_FILE);
    const assignedObj = users.find((u) => String(u._id) === String(newTask.assignedTo));
    const creatorObj = users.find((u) => String(u._id) === String(newTask.userId));

    return {
      ...newTask,
      assignedTo: assignedObj ? { _id: assignedObj._id, name: assignedObj.name, email: assignedObj.email } : null,
      userId: creatorObj ? { _id: creatorObj._id, name: creatorObj.name, email: creatorObj.email } : null
    };
  },

  updateTask: (taskId, updateData) => {
    const tasks = readData(TASKS_FILE);
    const index = tasks.findIndex((t) => String(t._id) === String(taskId));
    if (index === -1) throw new Error('Task not found');

    const t = tasks[index];
    if (updateData.title !== undefined) t.title = updateData.title.trim();
    if (updateData.description !== undefined) t.description = updateData.description.trim();
    if (updateData.status) t.status = updateData.status === 'Pending' ? 'To Do' : updateData.status;
    if (updateData.priority) t.priority = updateData.priority;
    if (updateData.assignedTo) t.assignedTo = updateData.assignedTo;
    if (updateData.dueDate !== undefined) t.dueDate = updateData.dueDate || null;

    tasks[index] = t;
    writeData(TASKS_FILE, tasks);

    const users = readData(USERS_FILE);
    const assignedObj = users.find((u) => String(u._id) === String(t.assignedTo));
    const creatorObj = users.find((u) => String(u._id) === String(t.userId));

    return {
      ...t,
      assignedTo: assignedObj ? { _id: assignedObj._id, name: assignedObj.name, email: assignedObj.email } : null,
      userId: creatorObj ? { _id: creatorObj._id, name: creatorObj.name, email: creatorObj.email } : null
    };
  },

  deleteTask: (taskId) => {
    let tasks = readData(TASKS_FILE);
    const index = tasks.findIndex((t) => String(t._id) === String(taskId));
    if (index === -1) throw new Error('Task not found');

    tasks = tasks.filter((t) => String(t._id) !== String(taskId));
    writeData(TASKS_FILE, tasks);
    return { id: taskId };
  },

  getTaskStats: (userId) => {
    const team = demoStore.getUserTeam(userId);
    const userTasks = demoStore.getTasks(userId, {});

    const total = userTasks.length;
    const completed = userTasks.filter((t) => t.status === 'Completed').length;
    const pending = userTasks.filter((t) => t.status === 'To Do' || t.status === 'Pending').length;
    const inProgress = userTasks.filter((t) => t.status === 'In Progress').length;

    return {
      teamName: team ? team.name : 'Personal Workspace',
      teamDescription: team ? team.description : '',
      memberCount: team && team.members ? team.members.length : 1,
      total,
      completed,
      pending,
      inProgress
    };
  }
};

module.exports = demoStore;
