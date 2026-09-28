const path = require('path');
const dotenv = require('dotenv');

// Load environment variables explicitly from backend/.env at the very top
dotenv.config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');

// Safe debug log for MONGODB_URI presence (does not print credentials)
const hasMongoUri = Boolean((process.env.MONGODB_URI || '').trim());
console.log(`MONGODB_URI loaded: ${hasMongoUri}`);

// Import and execute connectDB
const connectDB = require('./config/db');
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'TaskFlow API is running smoothly' });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ message: 'API Route Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
