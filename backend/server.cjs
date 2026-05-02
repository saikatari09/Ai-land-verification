// Backend API Server entrypoint
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');

// Load env from backend/.env if present
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));

// Mock auth (development only): set req.user as admin
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    req.user = { id: '000000000000000000000001', role: 'admin' };
  }
  next();
});

// Connect to MongoDB
if (!env.MONGO_URI) {
  console.warn('⚠️ MONGO_URI not set. Set it in backend/.env');
} else {
  connectDB();
}

// Routes
const adminRoutes = require('./src/routes/admin.routes');
const authRoutes = require('./src/routes/auth.routes');
const landsRoutes = require('./src/routes/lands');

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/lands', landsRoutes);

// Serve uploaded files statically
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running 🚀' });
});

// Serve frontend static files from dist folder
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// SPA fallback: serve index.html for non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'));
  } else {
    res.status(404).json({ error: 'Not found', path: req.path });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend API Server running on http://localhost:${PORT}`);
});
