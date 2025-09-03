# Course Review System - Backend Architecture

## Overview

The course review system has been restructured to use a proper backend API architecture instead of direct frontend-to-Supabase communication. This provides better security, validation, and maintainability.

## Architecture Diagram

```
┌─────────────────┐    HTTP Requests    ┌─────────────────┐    Supabase Client    ┌─────────────────┐
│   Frontend      │ ──────────────────► │   Backend       │ ──────────────────► │   Supabase      │
│   React App     │                     │   Express.js    │                     │   Database      │
│                 │                     │   API Routes    │                     │                 │
└─────────────────┘                     └─────────────────┘                     └─────────────────┘
```

## Backend Structure

### 1. **`backend/routes/courseReviews.js`**
- **Purpose**: Handles all course review operations
- **Endpoints**:
  - `GET /api/course-reviews` - Get all approved reviews
  - `GET /api/course-reviews/:university/:course` - Get reviews for specific course
  - `POST /api/course-reviews/submit` - Submit new review
  - `PUT /api/course-reviews/:id/approve` - Approve review (admin)
  - `DELETE /api/course-reviews/:id` - Delete review (admin)
  - `GET /api/course-reviews/health` - Health check

### 2. **`backend/supabaseClient.js`**
- **Purpose**: Centralized Supabase client configuration
- **Features**: Environment variable loading, error handling

### 3. **`backend/server.js`**
- **Purpose**: Main Express server with route registration
- **Features**: CORS, rate limiting, security middleware

## Frontend Structure

### 1. **`frontend/src/services/courseReviewService.ts`**
- **Purpose**: Frontend client for backend API
- **Features**: HTTP requests to backend, error handling, type safety

### 2. **`frontend/src/components/CourseReviewForm.tsx`**
- **Purpose**: Review submission form
- **Features**: Form validation, API integration, user feedback

### 3. **`frontend/src/components/CourseReviewsDisplay.tsx`**
- **Purpose**: Display course reviews
- **Features**: Dynamic loading, pagination, API integration

## Data Flow

### 1. **Review Submission**
```
User Input → Form Validation → Frontend Service → Backend API → Supabase Database
```

### 2. **Review Retrieval**
```
Component Mount → Frontend Service → Backend API → Supabase Database → UI Display
```

## API Endpoints

### Base URL: `http://localhost:3001/api/course-reviews`

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/` | Get all approved reviews | - | `{success: true, data: [...]}` |
| GET | `/:university/:course` | Get reviews for specific course | - | `{success: true, data: [...]}` |
| POST | `/submit` | Submit new review | Review data | `{success: true, data: {...}}` |
| PUT | `/:id/approve` | Approve review | - | `{success: true, data: {...}}` |
| DELETE | `/:id` | Delete review | - | `{success: true, message: "..."}` |
| GET | `/health` | Health check | - | `{status: "healthy", database: "connected"}` |

## Environment Variables

### Backend (`.env`)
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3001
FRONTEND_URL=http://localhost:8000
```

### Frontend (`.env`)
```bash
# No Supabase credentials needed - backend handles database operations
VITE_PERSPECTIVE_API_KEY=your_perspective_api_key
```

## Security Features

### 1. **Input Validation**
- Required field validation
- Data type validation
- Length restrictions
- Email format validation

### 2. **Rate Limiting**
- Global rate limiting
- Endpoint-specific limits
- IP-based restrictions

### 3. **CORS Protection**
- Configured origins
- Credential support
- Security headers

### 4. **Error Handling**
- Comprehensive error messages
- Database error handling
- User-friendly responses

## Testing

### 1. **Backend Testing**
```bash
cd backend
node test-course-reviews.js
```

### 2. **API Testing**
- Health check endpoint
- Review submission
- Review retrieval
- Error scenarios

### 3. **Frontend Testing**
- Form validation
- API integration
- Error handling
- User experience

## Benefits of This Architecture

### 1. **Security**
- Database credentials not exposed to frontend
- Centralized validation and sanitization
- Rate limiting and CORS protection

### 2. **Maintainability**
- Clear separation of concerns
- Centralized business logic
- Easy to modify and extend

### 3. **Scalability**
- Backend can be scaled independently
- Database connection pooling
- Caching opportunities

### 4. **Development Experience**
- Better error handling
- Easier debugging
- Consistent API responses

## Deployment

### 1. **Backend Deployment**
- Ensure environment variables are set
- Start Express server
- Verify Supabase connection

### 2. **Frontend Deployment**
- Update API base URL if needed
- Build and deploy React app
- Test API integration

### 3. **Database Setup**
- Verify `course_reviews` table exists
- Check table permissions
- Test CRUD operations

## Troubleshooting

### 1. **Backend Issues**
- Check environment variables
- Verify Supabase connection
- Review server logs

### 2. **Frontend Issues**
- Check API base URL
- Verify CORS configuration
- Review browser console

### 3. **Database Issues**
- Check Supabase dashboard
- Verify table schema
- Test direct database access

## Next Steps

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```

2. **Test API Endpoints**
   ```bash
   cd backend
   node test-course-reviews.js
   ```

3. **Verify Frontend Integration**
   - Test form submission
   - Test review display
   - Check error handling

4. **Monitor and Optimize**
   - Performance metrics
   - Error rates
   - User feedback

## Support

For issues or questions:
1. Check backend server logs
2. Verify environment variables
3. Test API endpoints directly
4. Review error messages
5. Check Supabase dashboard
