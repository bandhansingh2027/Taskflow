// Centralized Demo Data for TaskFlow Presentation Mode

export const defaultUser = {
  _id: 'user_demo_101',
  name: 'Demo User',
  email: 'demo@taskflow.com',
  role: 'Project Manager',
  avatar: 'DU',
  bio: 'Lead Product Manager & Full-Stack Architect overseeing TaskFlow sprint deliverables.'
};

export const initialTeam = {
  _id: 'team_demo_202',
  name: 'Engineering Core Team',
  description: 'Product engineering & UI/UX design workspace',
  members: [
    { _id: 'user_demo_101', name: 'Demo User', email: 'demo@taskflow.com', role: 'Project Manager', avatar: 'DU', status: 'Online' },
    { _id: 'user_demo_102', name: 'Sarah Jenkins', email: 'sarah.j@taskflow.com', role: 'Frontend Lead', avatar: 'SJ', status: 'Online' },
    { _id: 'user_demo_103', name: 'Alex Rivera', email: 'alex.r@taskflow.com', role: 'Backend Engineer', avatar: 'AR', status: 'Away' },
    { _id: 'user_demo_104', name: 'David Chen', email: 'david.c@taskflow.com', role: 'UI/UX Designer', avatar: 'DC', status: 'Online' },
    { _id: 'user_demo_105', name: 'Emily Watson', email: 'emily.w@taskflow.com', role: 'QA Specialist', avatar: 'EW', status: 'Online' },
    { _id: 'user_demo_106', name: 'Michael Scott', email: 'michael.s@taskflow.com', role: 'DevOps Lead', avatar: 'MS', status: 'Offline' },
    { _id: 'user_demo_107', name: 'Jessica Alba', email: 'jessica.a@taskflow.com', role: 'Product Analyst', avatar: 'JA', status: 'Online' }
  ]
};

export const initialTasks = [
  {
    _id: 'task_demo_1',
    title: 'Design Landing Page UI',
    description: 'Create responsive high-fidelity Figma prototypes for TaskFlow landing page and dark mode theme tokens.',
    status: 'Completed',
    priority: 'High',
    assignedTo: { _id: 'user_demo_104', name: 'David Chen', email: 'david.c@taskflow.com' },
    dueDate: '2026-10-05'
  },
  {
    _id: 'task_demo_2',
    title: 'Build Authentication UI & Forms',
    description: 'Implement login, registration, and password recovery forms with interactive field validation.',
    status: 'Completed',
    priority: 'High',
    assignedTo: { _id: 'user_demo_102', name: 'Sarah Jenkins', email: 'sarah.j@taskflow.com' },
    dueDate: '2026-10-08'
  },
  {
    _id: 'task_demo_3',
    title: 'Create Interactive Dashboard',
    description: 'Build stat cards, task status quick toggles, productivity meters, and real-time activity metrics.',
    status: 'In Progress',
    priority: 'High',
    assignedTo: { _id: 'user_demo_101', name: 'Demo User', email: 'demo@taskflow.com' },
    dueDate: '2026-10-12'
  },
  {
    _id: 'task_demo_4',
    title: 'API Integration & Middleware',
    description: 'Integrate state management context and local storage synchronization across all navigation routes.',
    status: 'In Progress',
    priority: 'Medium',
    assignedTo: { _id: 'user_demo_103', name: 'Alex Rivera', email: 'alex.r@taskflow.com' },
    dueDate: '2026-10-15'
  },
  {
    _id: 'task_demo_5',
    title: 'Testing & Bug Fixes',
    description: 'Perform end-to-end regression testing across browser viewports and verify clean zero-console errors.',
    status: 'In Progress',
    priority: 'Medium',
    assignedTo: { _id: 'user_demo_105', name: 'Emily Watson', email: 'emily.w@taskflow.com' },
    dueDate: '2026-10-18'
  },
  {
    _id: 'task_demo_6',
    title: 'Prepare Presentation Deck',
    description: 'Assemble live demonstration workflow, feature highlights, and architecture walkthrough slides.',
    status: 'To Do',
    priority: 'High',
    assignedTo: { _id: 'user_demo_101', name: 'Demo User', email: 'demo@taskflow.com' },
    dueDate: '2026-10-20'
  },
  {
    _id: 'task_demo_7',
    title: 'CI/CD Pipeline Setup',
    description: 'Configure automated GitHub Actions workflows for continuous build testing and static asset bundle deployment.',
    status: 'To Do',
    priority: 'Medium',
    assignedTo: { _id: 'user_demo_106', name: 'Michael Scott', email: 'michael.s@taskflow.com' },
    dueDate: '2026-10-22'
  },
  {
    _id: 'task_demo_8',
    title: 'User Analytics & Reporting',
    description: 'Gather user interaction telemetry to generate weekly productivity summaries and team efficiency stats.',
    status: 'To Do',
    priority: 'Low',
    assignedTo: { _id: 'user_demo_107', name: 'Jessica Alba', email: 'jessica.a@taskflow.com' },
    dueDate: '2026-10-25'
  },
  {
    _id: 'task_demo_9',
    title: 'Documentation & API Guides',
    description: 'Write developer sitemap guides and setup instructions for frontend and backend workspace configuration.',
    status: 'Completed',
    priority: 'Low',
    assignedTo: { _id: 'user_demo_102', name: 'Sarah Jenkins', email: 'sarah.j@taskflow.com' },
    dueDate: '2026-09-28'
  },
  {
    _id: 'task_demo_10',
    title: 'Final Review & Sprint Demo',
    description: 'Conduct final peer walkthrough with stakeholders and verify presentation demo readiness.',
    status: 'To Do',
    priority: 'High',
    assignedTo: { _id: 'user_demo_101', name: 'Demo User', email: 'demo@taskflow.com' },
    dueDate: '2026-10-01'
  }
];

export const initialNotifications = [
  {
    id: 'notif_1',
    title: 'Task Completed',
    message: 'David Chen completed "Design Landing Page UI"',
    time: '10 minutes ago',
    read: false,
    type: 'success'
  },
  {
    id: 'notif_2',
    title: 'New Team Member',
    message: 'Jessica Alba joined Engineering Core Team as Product Analyst',
    time: '1 hour ago',
    read: false,
    type: 'info'
  },
  {
    id: 'notif_3',
    title: 'Task Assigned',
    message: 'You were assigned to "Create Interactive Dashboard"',
    time: '3 hours ago',
    read: false,
    type: 'warning'
  },
  {
    id: 'notif_4',
    title: 'Sprint Sync Meeting',
    message: 'Weekly Engineering Sync is scheduled for today at 3:00 PM',
    time: 'Yesterday',
    read: true,
    type: 'info'
  },
  {
    id: 'notif_5',
    title: 'Deployment Ready',
    message: 'TaskFlow v1.0 release bundle compiled cleanly with 0 errors.',
    time: '2 days ago',
    read: true,
    type: 'success'
  }
];
