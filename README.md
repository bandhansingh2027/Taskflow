# TaskFlow - Full-Stack MERN Task Management Application

TaskFlow is a clean, modern, and beginner-friendly Task Management web application built using the **MERN** stack (**M**ongoDB, **E**xpress.js, **R**eact.js, **N**ode.js). Users can register an account, log in securely using JSON Web Tokens (JWT), manage tasks (Create, Read, Update, Delete), filter tasks by status and priority, search tasks, and view real-time task statistics on an interactive dashboard.

---

## 🚀 Features

- **User Authentication**:
  - Secure registration & login with password hashing via `bcryptjs`.
  - Stateless authentication powered by `jsonwebtoken` (JWT).
  - Client-side token storage & protected page routing.
  - One-click logout that clears tokens.

- **Dashboard & Stats**:
  - Displays total tasks, completed tasks, pending tasks, and in-progress tasks.
  - Overview of recent tasks with direct status updates.

- **Task Management (CRUD)**:
  - **Create**: Add new tasks with title, description, status, and priority.
  - **Read**: View personal tasks list with responsive layout.
  - **Update**: Edit task details, title, description, status, or priority.
  - **Delete**: Remove unwanted tasks securely.

- **Search & Filtering**:
  - Instant keyword search across task title and description.
  - Status filter (`Pending`, `In Progress`, `Completed`).
  - Priority filter (`Low`, `Medium`, `High`).

- **Data Privacy & Security**:
  - Strict user-level authorization: users can only view, edit, and delete their own tasks.

---

## 🛠️ Tech Stack

### Backend
- **Node.js & Express.js**: REST API server framework.
- **MongoDB & Mongoose**: Object Data Modeling (ODM) for database operations.
- **jsonwebtoken (JWT)**: Secure user authentication tokens.
- **bcryptjs**: Safe password hashing.
- **dotenv**: Environment variable management.
- **cors**: Cross-Origin Resource Sharing.

### Frontend
- **React.js (Vite)**: Modern frontend library and build tool.
- **React Router DOM (v6)**: Page routing and protected route guards.
- **Axios**: HTTP client with request interceptors for token attachment.
- **Lucide React**: Clean icons.
- **Vanilla CSS**: Styled design system with dark/light themes, badges, animations, and responsive layout.

---

## 📁 Project Structure

```text
Taskflow/
├── backend/
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js # Register & Login logic
│   │   └── taskController.js # Task CRUD & Stats logic
│   ├── middleware/
│   │   └── authMiddleware.js # JWT verification middleware
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── Task.js          # Task schema
│   ├── routes/
│   │   ├── authRoutes.js    # /api/auth routes
│   │   └── taskRoutes.js    # /api/tasks routes
│   ├── .env                 # Backend environment variables
│   ├── package.json         # Backend dependencies
│   └── server.js            # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js     # Axios instance & interceptors
│   │   ├── components/
│   │   │   ├── Navbar.jsx   # Top navigation header
│   │   │   ├── ProtectedRoute.jsx # Auth route wrapper
│   │   │   └── TaskCard.jsx # Task card component
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global auth state manager
│   │   ├── pages/
│   │   │   ├── Login.jsx    # Login page
│   │   │   ├── Register.jsx # Register page
│   │   │   ├── Dashboard.jsx# Stats & Summary page
│   │   │   ├── Tasks.jsx    # Task management page
│   │   │   ├── AddTask.jsx  # Task creation page
│   │   │   └── EditTask.jsx # Task editing page
│   │   ├── App.jsx          # Routes & main layout
│   │   ├── main.jsx         # React DOM entry point
│   │   └── index.css        # Custom CSS design system
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite server config
│
├── .env.example             # Example environment file
└── README.md                # Documentation & Viva guide
```

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Log in user and receive JWT | Public |

### Task Routes (`/api/tasks`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks/stats` | Get task counts (Total, Completed, Pending, In Progress) | Private |
| `GET` | `/api/tasks` | Get user tasks (with search & status/priority filter) | Private |
| `POST` | `/api/tasks` | Create a new task | Private |
| `PUT` | `/api/tasks/:id` | Update an existing task by ID | Private |
| `DELETE` | `/api/tasks/:id` | Delete a task by ID | Private |

---

## ⚡ Step-by-Step Setup & How to Run

### Prerequisites
- Node.js (v16 or higher)
- MongoDB running locally on `mongodb://127.0.0.1:27017` OR MongoDB Atlas connection string. (Note: an automatic in-memory fallback server is also included for zero-config local testing).

### 1. Setup Backend
```bash
cd backend
npm install
```

Configure `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=supersecret_taskflow_jwt_key_2026
```

Start backend server:
```bash
npm run dev
# or: node server.js
```
The backend server runs on `http://localhost:5000`.

### 2. Setup Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend application will open on `http://localhost:3000`.

---

## 🎓 Viva Explanation Guide (For B.Tech / Academic Interviews)

### 1. How the Frontend Works
- Built with **React.js** using functional components and React Hooks (`useState`, `useEffect`, `useContext`).
- Routing is managed by **React Router v6**. Pages like Dashboard, Tasks, AddTask, and EditTask are wrapped inside `<ProtectedRoute>` which checks if a valid JWT token exists in `localStorage`.
- Component state is passed cleanly without unnecessary Redux overhead. Global user authentication state is managed using React's native **Context API** (`AuthContext.jsx`).

### 2. How the Backend Works
- Built on **Node.js** with **Express.js**.
- `server.js` initializes Express, enables CORS middleware for cross-origin requests, parses incoming JSON payloads, connects to MongoDB via Mongoose, and mounts router paths (`/api/auth` and `/api/tasks`).
- Architecture follows the **MVC Controller-Route pattern** (Models, Controllers, Routes, Middleware) for modularity and scalability.

### 3. MongoDB Database Connection
- `config/db.js` uses `mongoose.connect()` to establish a connection with MongoDB.
- Mongoose schemas (`User.js` and `Task.js`) enforce data types, default values, and schema validations.
- `Task` model stores `userId` as a reference (`mongoose.Schema.Types.ObjectId`) linked to the `User` model.

### 4. JWT Authentication & Security
- When a user registers or logs in, `authController.js` hashes the password using `bcryptjs` before checking/saving.
- If credentials match, the server generates a signed **JWT (JSON Web Token)** using `jwt.sign({ id: user._id }, JWT_SECRET)`.
- The client receives the token and stores it in `localStorage`.
- For every protected API request, **Axios Interceptor** attaches `Authorization: Bearer <token>` in HTTP headers.
- `authMiddleware.js` extracts the token, verifies it with `jwt.verify()`, retrieves the user record, and attaches `req.user` to the request object.

### 5. CRUD Operations Flow
- **Create**: `POST /api/tasks` creates a document with `req.user._id` attached as `userId`.
- **Read**: `GET /api/tasks` executes `Task.find({ userId: req.user._id })`.
- **Update**: `PUT /api/tasks/:id` checks if `task.userId === req.user._id` before applying `task.save()`.
- **Delete**: `DELETE /api/tasks/:id` verifies ownership before executing `Task.findByIdAndDelete()`.

### 6. Dashboard Statistics
- `GET /api/tasks/stats` uses MongoDB `countDocuments()` queries to calculate statistics for the logged-in user:
  - Total: `Task.countDocuments({ userId })`
  - Completed: `Task.countDocuments({ userId, status: 'Completed' })`
  - Pending: `Task.countDocuments({ userId, status: 'Pending' })`
  - In Progress: `Task.countDocuments({ userId, status: 'In Progress' })`

### 7. End-to-End API Flow Example
1. User types login credentials on `Login.jsx` -> sends `POST /api/auth/login`.
2. Backend verifies password via `bcrypt.compare()` -> returns `{ token }`.
3. Client saves `token` -> redirects to `/dashboard`.
4. Dashboard page fires `API.get('/tasks/stats')` with `Authorization: Bearer <token>`.
5. `authMiddleware` validates token -> sets `req.user` -> controller returns user stats JSON -> Dashboard renders state metrics cards.
