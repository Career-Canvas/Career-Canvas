# Career Canvas LLM Review Filtering Setup Guide

This guide explains how to implement AI-powered review filtering using Hugging Face's toxicity detection API to automatically filter out offensive content from university reviews.

## 🏗️ Architecture Overview

The solution consists of:
1. **Backend API** (Node.js/Express) - Handles review filtering and submission
2. **Frontend Integration** (React) - Updated review submission forms
3. **AI Service** (Hugging Face API) - Toxicity detection using `toxic-bert` model

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env and add your Hugging Face API key
HUGGING_FACE_API_KEY=your_actual_api_key_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Start the server
npm run dev
```

### 2. Get Hugging Face API Key

1. Go to [Hugging Face](https://huggingface.co/)
2. Create an account or sign in
3. Go to Profile → Settings → Access Tokens
4. Create a new token with "read" permissions
5. Copy the token to your `.env` file

### 3. Test the Backend

```bash
# Test the API health
curl http://localhost:3001/api/reviews/health

# Test review filtering
curl -X POST http://localhost:3001/api/reviews/filter \
  -H "Content-Type: application/json" \
  -d '{"reviewText": "This is a test review"}'
```

## 🔧 How It Works

### Toxicity Detection

The system uses Hugging Face's `unitary/toxic-bert` model to detect:

- **Toxic** (threshold: 0.7) - General toxic content
- **Severe Toxic** (threshold: 0.6) - Highly offensive content  
- **Obscene** (threshold: 0.6) - Vulgar language
- **Threat** (threshold: 0.5) - Violent/threatening language
- **Insult** (threshold: 0.6) - Insulting content
- **Identity Hate** (threshold: 0.5) - Hate speech

### Review Flow

1. User submits review through frontend
2. Frontend sends review to backend API
3. Backend calls Hugging Face API for toxicity analysis
4. If offensive content detected, review is rejected with explanation
5. If content is clean, review is approved and stored

## 📡 API Endpoints

### Health Check
```
GET /api/reviews/health
```

### Filter Single Review
```
POST /api/reviews/filter
Body: { "reviewText": "Your review text" }
```

### Submit Review (with filtering)
```
POST /api/reviews/submit
Body: {
  "reviewText": "Review text",
  "universityName": "University name",
  "category": "Category",
  "rating": 5,
  "author": "Author name"
}
```

### Batch Filter Reviews
```
POST /api/reviews/filter-batch
Body: { "reviews": ["Review 1", "Review 2"] }
```

## 🎯 Frontend Integration

The frontend has been updated with:

1. **ReviewSubmissionForm Component** - New form with AI filtering
2. **Review Service** - API integration layer
3. **Updated UniversitySections** - Integrated review submission

### Key Features

- Real-time content filtering before submission
- Detailed toxicity analysis display
- User-friendly error messages for rejected content
- Automatic form validation and submission

## 🛡️ Security Features

- **Rate Limiting** - Prevents API abuse
- **CORS Protection** - Configurable origin restrictions
- **Input Validation** - Sanitizes all inputs
- **Environment Variables** - Secure configuration
- **Helmet** - Security headers

## 📊 Monitoring & Testing

### Health Checks
```bash
# Backend health
curl http://localhost:3001/health

# Review API health
curl http://localhost:3001/api/reviews/health
```

### Test Script
```bash
cd backend
node test-api.js
```

## 🔍 Troubleshooting

### Common Issues

1. **API Key Error**
   - Ensure `HUGGING_FACE_API_KEY` is set in `.env`
   - Check token has "read" permissions

2. **CORS Error**
   - Verify `FRONTEND_URL` in `.env` matches your frontend
   - Check browser console for CORS errors

3. **Rate Limiting**
   - Reduce request frequency
   - Increase limits in `.env` if needed

4. **Timeout Issues**
   - Check network connectivity to Hugging Face
   - Increase timeout in `reviewFilter.js` if needed

### Performance Tips

- Use batch filtering for multiple reviews
- Implement client-side caching
- Monitor API response times

## 🚀 Production Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=3001
HUGGING_FACE_API_KEY=your_production_key
FRONTEND_URL=https://yourdomain.com
```

### Security Considerations
- Use HTTPS in production
- Implement proper authentication
- Add request logging
- Set up monitoring and alerts

## 📈 Future Enhancements

1. **Database Integration** - Store approved reviews
2. **User Authentication** - Track review authors
3. **Moderation Queue** - Manual review of flagged content
4. **Analytics Dashboard** - Filtering statistics
5. **Custom Models** - Fine-tuned toxicity detection

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API response logs
3. Test with the provided test script
4. Verify environment configuration

## 📝 License

This implementation is part of the Career Canvas project and follows the same license terms.
