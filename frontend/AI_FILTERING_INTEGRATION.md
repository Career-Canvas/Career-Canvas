# AI Content Filtering Integration for Course Reviews

## Overview

The course review system now includes AI-powered content filtering using Google's Perspective API, similar to the existing campus review system. This ensures that all course reviews are automatically analyzed for inappropriate content before being submitted to the database.

## Architecture

### Backend Integration

1. **New Service**: `backend/services/courseReviewFilter.js`
   - Uses Google Perspective API for toxicity analysis
   - Analyzes multiple toxicity categories (toxic, severe_toxicity, identity_attack, insult, profanity, threat, sexually_explicit)
   - Provides detailed feedback on why content was flagged

2. **Enhanced API Routes**: `backend/routes/courseReviews.js`
   - `/filter` - Analyze single review for offensive content
   - `/filter-batch` - Analyze multiple reviews at once
   - Enhanced `/submit` endpoint with automatic filtering

3. **Database Integration**
   - Reviews are only saved if they pass AI filtering
   - `is_approved` field is automatically set based on AI analysis results

### Frontend Integration

1. **Enhanced Service**: `frontend/src/services/courseReviewService.ts`
   - New `FilterResult` interface matching backend response
   - `filterCourseReview()` function for single review analysis
   - `filterCourseReviewsBatch()` function for multiple reviews
   - Utility functions for toxicity level and category names

2. **Updated Form Component**: `frontend/src/components/CourseReviewForm.tsx`
   - Real-time content analysis during submission
   - Detailed display of toxicity scores and categories
   - Visual indicators for approved vs. flagged content
   - Automatic rejection of inappropriate content

## How It Works

### 1. Content Submission Flow

```
User submits review → Backend AI filtering → Database storage (if approved)
                ↓
         AI analysis results → User feedback
```

### 2. AI Analysis Process

1. **Text Validation**: Checks length (10-1000 characters)
2. **API Call**: Sends text to Google Perspective API
3. **Score Analysis**: Evaluates 7 toxicity categories
4. **Threshold Check**: Compares scores against safety thresholds
5. **Decision**: Approves or rejects based on analysis

### 3. Toxicity Categories & Thresholds

| Category | Threshold | Description |
|----------|-----------|-------------|
| General Toxicity | 0.3 | Overall inappropriate content |
| Severe Toxicity | 0.2 | Highly offensive content |
| Identity Attack | 0.2 | Attacks based on identity |
| Insult | 0.2 | Personal insults |
| Profanity | 0.2 | Offensive language |
| Threat | 0.15 | Threatening content |
| Sexually Explicit | 0.2 | Inappropriate sexual content |

## User Experience

### Content Approval
- ✅ **Green indicator** with checkmark
- Shows "Content Approved" message
- Displays detailed toxicity scores
- Review proceeds to database

### Content Rejection
- ❌ **Red indicator** with X mark
- Shows "Content Flagged" message
- Explains specific reasons for rejection
- Suggests content revision
- Review is not saved

### Detailed Feedback
- Individual scores for each toxicity category
- Highest risk category identification
- Confidence percentages for flagged content
- Clear guidance on what needs to be changed

## API Endpoints

### POST `/api/course-reviews/filter`
Analyzes a single review for offensive content.

**Request:**
```json
{
  "reviewText": "Review text to analyze"
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
      "toxicity": 0.1,
      "severe_toxicity": 0.05,
      "identity_attack": 0.02
    },
    "highestRisk": null
  }
}
```

### POST `/api/course-reviews/filter-batch`
Analyzes multiple reviews at once.

**Request:**
```json
{
  "reviews": ["Review 1", "Review 2", "Review 3"]
}
```

### POST `/api/course-reviews/submit`
Submits a review with automatic AI filtering.

**Response includes both review data and filtering results:**
```json
{
  "success": true,
  "message": "Course review submitted successfully",
  "data": {
    "review": { /* review data */ },
    "filterResult": { /* filtering results */ }
  }
}
```

## Testing

### Backend Testing
```bash
cd backend
node test-course-reviews.js
```

This will test:
1. Health check
2. Get all reviews
3. Content filtering
4. Review submission with AI analysis
5. Get specific course reviews

### Frontend Testing
1. Navigate to `/course-reviews`
2. Try submitting reviews with various content types
3. Test both appropriate and inappropriate content
4. Verify filtering results display correctly

## Configuration

### Environment Variables
```bash
# Backend (.env)
GOOGLE_PERSPECTIVE_API_KEY=your_api_key_here
```

### API Key Setup
1. Get Google Perspective API key from Google Cloud Console
2. Add to backend `.env` file
3. Restart backend server

## Benefits

1. **Content Quality**: Ensures only appropriate reviews are published
2. **User Safety**: Protects students from harmful content
3. **Automated Moderation**: No manual review process needed
4. **Transparent Feedback**: Users understand why content was rejected
5. **Consistent Standards**: Same filtering applied to all reviews
6. **Real-time Analysis**: Immediate feedback during submission

## Future Enhancements

1. **Custom Thresholds**: Allow admins to adjust sensitivity levels
2. **Language Support**: Add support for multiple languages
3. **Context Awareness**: Consider course context in analysis
4. **User Appeals**: Allow users to request manual review
5. **Learning System**: Improve thresholds based on user feedback

## Troubleshooting

### Common Issues

1. **API Key Missing**
   - Check backend environment variables
   - Verify API key is valid and has proper permissions

2. **Filtering Not Working**
   - Check backend logs for API errors
   - Verify Google Perspective API is accessible

3. **False Positives/Negatives**
   - Adjust threshold values in `courseReviewFilter.js`
   - Monitor filtering results and fine-tune

### Debug Mode
Backend logs detailed information about:
- API requests and responses
- Toxicity scores and thresholds
- Filtering decisions and reasons

## Security Considerations

1. **API Key Protection**: Never expose API keys in frontend code
2. **Rate Limiting**: Consider implementing rate limits for filtering requests
3. **Input Validation**: All user input is validated before processing
4. **Error Handling**: Graceful fallbacks if AI service is unavailable

## Performance

- **Response Time**: AI analysis typically takes 1-3 seconds
- **Caching**: Consider implementing result caching for repeated content
- **Batch Processing**: Use batch endpoint for multiple reviews
- **Async Processing**: Non-blocking analysis during submission

---

The AI filtering system is now fully integrated and ready for production use. All course reviews will be automatically analyzed for content safety, ensuring a positive and educational environment for students.
