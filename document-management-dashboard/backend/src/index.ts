import dotenv from 'dotenv';
// Load environment variables first
dotenv.config();

import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import router from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initSocket } from './services/socketService.js';

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5001;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

// Security configuration
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
app.use(cors({
  origin: frontendUrl,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Parse payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Socket.IO connection
initSocket(server, frontendUrl);

// Base application routes
app.use('/api', router);

// Serve static directory (as a backup option, though download controller is primary)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Catch-all route handler for 404s
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});

// Centralized error treatment
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Document Dashboard backend running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

export { server, app };
