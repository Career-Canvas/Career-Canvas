import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import your API routes
import { reviewRoutes } from './routes/reviews.js';
import { personalityRoutes } from './routes/personality.js'; // <-- Import new routes

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware Setup ---

// Security middleware
app.use(helmet());

// CORS configuration to allow requests from your frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080'],
  credentials: true
}));

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware to handle JSON payloads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// --- API Routes ---

// Health check endpoint to verify the server is running
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Career Canvas API'
  });
});

// Use the imported routes
app.use('/api/reviews', reviewRoutes);
app.use('/api/personality', personalityRoutes); // <-- Use new personality routes


// --- Error Handling ---

// Custom 404 handler for routes that don't exist
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('An unexpected error occurred:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong on our end.'
  });
});


// --- Server Initialization ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Review API available at http://localhost:${PORT}/api/reviews`);
  console.log(`🧠 Personality API available at http://localhost:${PORT}/api/personality`);
  console.log(`🏥 Health check at http://localhost:${PORT}/health`);
});

export default app;