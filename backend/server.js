import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './utils/db.js';
import playerRoutes from './routes/playerRoutes.js';
import cookieParser from 'cookie-parser';

import tempRoutes from './routes/tempRoutes.js'; 
import matchRoutes from './routes/matchesRoutes.js';
import tournamentRoutes from './routes/tournamentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL_admin,
  process.env.FRONTEND_URL_user
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true, // This is crucial
  exposedHeaders: ['set-cookie'] // Helps with cookie issues
}));

app.use(express.json());
app.use(cookieParser());

// Serve the uploads folder statically so images are accessible from frontend
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/players', playerRoutes);
app.use('/api/temp', tempRoutes); 
app.use('/api/matches', matchRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/admin', adminRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('🏏 Cricket Club Player Registration API');
});

// Start the server
const PORT = process.env.PORT || 6030;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
