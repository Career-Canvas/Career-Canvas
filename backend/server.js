import dotenv from 'dotenv';
// Load environment variables FIRST - before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';

// Debug: Check if variables are loaded
console.log('🔍 Environment check:');
console.log('API Key exists:', !!process.env.GOOGLE_PERSPECTIVE_API_KEY);
console.log('Supabase URL exists:', !!process.env.SUPABASE_URL);
console.log('Supabase Key exists:', !!process.env.SUPABASE_ANON_KEY);
console.log('Frontend URL:', process.env.FRONTEND_URL);
console.log('Port:', process.env.PORT);

// Initialize Supabase client here, in the main server file
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    '🔥 Supabase URL or Key not found in .env file. Please check your configuration.'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

// NOW import routes (these routes already use supabase via supabaseClient.js)
import { reviewRoutes } from './routes/reviews.js';
import { courseReviewRoutes } from './routes/courseReviews.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration - Allow multiple origins for development
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:8000',
  'http://localhost:8080',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Rate limiting - More generous for chatbot usage
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000, // 1 minute window
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 30, // 30 requests per minute
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for health checks
  skip: (req) => req.path === '/health',
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Career Canvas Review API',
  });
});

// Chatbot-specific rate limiting - More generous for AI interactions
const chatbotLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per IP for chatbot
  message: 'Chatbot rate limit exceeded. Please wait a moment before asking another question.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Chatbot endpoint with its own rate limiting
app.post('/api/chatbot', chatbotLimiter, (req, res) => {
  // This endpoint can be used to proxy chatbot requests if needed
  res.json({ message: 'Chatbot endpoint ready' });
});

// ✅ Use router directly (no supabase passed here)
app.use('/api/reviews', reviewRoutes);
app.use('/api/course-reviews', courseReviewRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Something went wrong',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    `📝 Review filtering API available at http://localhost:${PORT}/api/reviews`
  );
  console.log(
    `📝 Course reviews API available at http://localhost:${PORT}/api/course-reviews`
  );
  console.log(`🏥 Health check at http://localhost:${PORT}/health`);
  console.log(
    `🔑 Google API Key loaded: ${
      process.env.GOOGLE_PERSPECTIVE_API_KEY ? 'YES' : 'NO'
    }`
  );
  console.log(
    `🔑 Supabase URL loaded: ${process.env.SUPABASE_URL ? 'YES' : 'NO'}`
  );
});

export default app;
