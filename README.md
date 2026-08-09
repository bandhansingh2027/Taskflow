# TaskFlow - Team Task Management Application

TaskFlow is a simple, modern, and full-stack **Team Task Management** web application built using the **MERN** stack (**M**ongoDB, **E**xpress.js, **R**eact.js, **N**ode.js). Users can create teams, add members by email, assign tasks to team members, update task statuses (`To Do`, `In Progress`, `Completed`), set priority levels (`Low`, `Medium`, `High`), and track team metrics on an interactive Team Dashboard.

---

## 🚀 Features

- **User Authentication**:
  - Secure registration & login with password hashing via `bcryptjs`.
  - JWT token authentication stored in `localStorage`.
  - Client-side route protection.

- **Team Management (`MyTeam`)**:
  - **Create Team**: Define Team Name and Description.
  - **View Team**: View active team details and member directory.
  - **Add Team Member**: Easily add registered users to the team by their email address.

- **Team Tasks**:
  - **Assign Tasks**: Assign any team task to a specific team member.
  - **Status Workflow**: Track task progress across `To Do`, `In Progress`, and `Completed`.
  - **Priority Levels**: Flag tasks as `Low`, `Medium`, or `High` priority.
  - **CRUD Operations**: Add, view, edit, delete, and quick-toggle task status.
  - **Search & Filter**: Keyword search with status and priority filtering.

- **Team Dashboard**:
  - Displays **Team Name**, Total Tasks, Pending Tasks (`To Do`), In Progress, and Completed task counts.
  - **Team Tasks Table**: Displays **Task Name | Assigned To | Status** with inline status controls.

- **Navbar**:
  - **Dashboard** | **My Team** | **Tasks** | **Add Task** | **Logout**

---

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), React Router DOM (v6), Axios, Lucide Icons, Custom CSS (dark/purple design system).
- **Backend**: Node.js, Express.js, Mongoose, MongoDB, jsonwebtoken (JWT), bcryptjs, dotenv, cors.

---

## 📁 Project Structure

```text
Taskflow/
├── backend/
│   ├── config/db.js            # MongoDB connection with fallback
│   ├── controllers/
│   │   ├── authController.js   # Auth endpoints
│   │   ├── teamController.js   # Team & member management
│   │   └── taskController.js   # Team task CRUD & stats
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT authentication
│   ├── models/
│   │   ├── User.js             # User model
│   │   ├── Team.js             # Team model (name, creator, members)
│   │   └── Task.js             # Task model (teamId, assignedTo, status, priority)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── teamRoutes.js
│   │   └── taskRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/axios.js        # Axios instance with JWT interceptor
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Dashboard, My Team, Tasks, Add Task, Logout
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── TaskCard.jsx    # Displays Assigned To badge & To Do status
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx   # Team Dashboard & Task Name | Assigned To | Status table
│   │   │   ├── MyTeam.jsx      # Create Team & Add Member page
│   │   │   ├── Tasks.jsx       # Team task grid & filters
│   │   │   ├── AddTask.jsx     # Assignee dropdown & task creation
│   │   │   └── EditTask.jsx    # Task update form
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # Dark/purple visual design system
│   ├── package.json
│   └── vite.config.js
│
├── .env.example
└── README.md
```

---

## ⚡ How to Run the Project

### 1. Start Backend
```bash
cd backend
npm install
npm run dev
```
*(Backend server runs on `http://localhost:5000`)*

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
*(Frontend app runs on `http://localhost:3000`)*
