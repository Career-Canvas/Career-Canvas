# Career Canvas Review Filtering Backend

This backend service provides AI-powered review filtering using Hugging Face's toxicity detection API to automatically identify and filter out offensive content from university reviews.

## Features

- 🤖 **AI-Powered Filtering**: Uses Hugging Face's `toxic-bert` model for accurate toxicity detection
- 🚫 **Multi-Category Detection**: Identifies toxic, severe toxic, obscene, threatening, insulting, and identity-based hate content
- 📝 **Review Submission**: Complete review submission workflow with automatic filtering
- 🔄 **Batch Processing**: Filter multiple reviews simultaneously (up to 10 per batch)
- 🛡️ **Security**: Rate limiting, CORS protection, and input validation
- 📊 **Detailed Analysis**: Provides toxicity scores and detailed rejection reasons

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your Hugging Face API key:

```bash
cp env.example .env
```

Edit `.env` and add your Hugging Face API key:

```env
HUGGING_FACE_API_KEY=your_actual_api_key_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Get Hugging Face API Key

1. Go to [Hugging Face](https://huggingface.co/)
2. Create an account or sign in
3. Go to your profile → Settings → Access Tokens
4. Create a new token with "read" permissions
5. Copy the token to your `.env` file

### 4. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on port 3001 (or the port specified in your `.env` file).

## API Endpoints

### Health Check
```
GET /health
```
Check if the server is running.

### Filter Single Review
```
POST /api/reviews/filter
```
Filter a single review for offensive content.

**Request Body:**
```json
{
  "reviewText": "Your review text here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isOffensive": false,
    "isApproved": true,
    "reason": "Content approved",
    "toxicityScores": {
      "toxic": 0.1,
      "severe_toxic": 0.05,
      "obscene": 0.02,
      "threat": 0.01,
      "insult": 0.03,
      "identity_hate": 0.01
    }
  }
}
```

### Filter Multiple Reviews
```
POST /api/reviews/filter-batch
```
Filter up to 10 reviews simultaneously.

**Request Body:**
```json
{
  "reviews": [
    "First review text",
    "Second review text",
    "Third review text"
  ]
}
```

### Submit Review
```
POST /api/reviews/submit
```
Submit a complete review with automatic filtering.

**Request Body:**
```json
{
  "reviewText": "Your review text here",
  "universityName": "University of Example",
  "category": "Campus Life",
  "rating": 5,
  "author": "John Doe"
}
```

## Toxicity Detection

The service uses the `unitary/toxic-bert` model which detects:

- **Toxic**: General toxic content
- **Severe Toxic**: Highly offensive content
- **Obscene**: Vulgar or inappropriate language
- **Threat**: Violent or threatening language
- **Insult**: Insulting or derogatory content
- **Identity Hate**: Hate speech based on identity

### Thresholds

Each category has configurable thresholds in `services/reviewFilter.js`:

```javascript
const thresholds = {
  toxic: 0.7,        // High threshold for toxic content
  severe_toxic: 0.6, // Lower threshold for severe toxicity
  obscene: 0.6,      // Lower threshold for obscene content
  threat: 0.5,       // Lower threshold for threats
  insult: 0.6,       // Lower threshold for insults
  identity_hate: 0.5 // Lower threshold for identity-based hate
};
```

## Frontend Integration

To integrate with your React frontend, update the review submission logic:

```typescript
// Example frontend integration
const submitReview = async (reviewData) => {
  try {
    const response = await fetch('http://localhost:3001/api/reviews/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    const result = await response.json();
    
    if (result.success) {
      // Review approved and submitted
      console.log('Review submitted successfully');
    } else {
      // Review rejected due to offensive content
      console.error('Review rejected:', result.message);
    }
  } catch (error) {
    console.error('Error submitting review:', error);
  }
};
```

## Error Handling

The service provides detailed error messages and fallback behavior:

- **API Unavailable**: Falls back to rejecting reviews if Hugging Face API is down
- **Invalid Input**: Returns specific validation errors
- **Rate Limiting**: Prevents abuse with configurable limits
- **Timeout Protection**: 10-second timeout for API calls

## Security Features

- **CORS Protection**: Configurable origin restrictions
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Sanitizes and validates all inputs
- **Helmet**: Security headers for Express
- **Environment Variables**: Secure configuration management

## Monitoring

Check the service health:

```bash
curl http://localhost:3001/api/reviews/health
```

Monitor logs for:
- API call success/failure rates
- Toxicity detection accuracy
- Performance metrics

## Troubleshooting

### Common Issues

1. **API Key Error**: Ensure `HUGGING_FACE_API_KEY` is set in `.env`
2. **CORS Error**: Check `FRONTEND_URL` in `.env` matches your frontend
3. **Rate Limit**: Reduce request frequency or increase limits
4. **Timeout**: Check network connectivity to Hugging Face API

### Performance Tips

- Use batch filtering for multiple reviews
- Implement client-side caching for repeated content
- Monitor API response times and adjust timeouts

## License

MIT License - see LICENSE file for details.
