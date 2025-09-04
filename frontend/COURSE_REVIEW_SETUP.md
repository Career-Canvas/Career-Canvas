# Course Review System Setup Guide

## Overview
This guide explains how to set up and use the new course review system for the Career Canvas website.

## Components Created

### 1. CourseReviewForm.tsx
- **Location**: `src/components/CourseReviewForm.tsx`
- **Purpose**: Main form component for submitting course reviews
- **Features**:
  - Dynamic university and course selection
  - AI-powered content moderation using Google Perspective API
  - Real-time toxicity analysis
  - Form validation and error handling

### 2. CourseReviewsDisplay.tsx
- **Location**: `src/components/CourseReviewsDisplay.tsx`
- **Purpose**: Displays submitted reviews for specific courses
- **Features**:
  - Paginated review display
  - Content safety indicators
  - User-friendly controls
  - Integration with course cards

### 3. CourseReviewService.ts
- **Location**: `src/services/courseReviewService.ts`
- **Purpose**: Service layer for future Supabase database integration
- **Features**:
  - Type definitions for course reviews
  - Mock API functions (ready for real implementation)
  - Error handling and response formatting

### 4. CourseReviewDemo.tsx
- **Location**: `src/pages/CourseReviewDemo.tsx`
- **Purpose**: Demo page showcasing the complete review system
- **Features**:
  - Interactive overview of system capabilities
  - Live form demonstration
  - Reviews display examples
  - Course selection interface

## Environment Variables Required

Create a `.env` file in the frontend directory with:

```bash
# Google Perspective API Key for content toxicity analysis
VITE_PERSPECTIVE_API_KEY=your_perspective_api_key_here

# Supabase Configuration (for future use)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Getting a Perspective API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Perspective API
4. Create credentials (API Key)
5. Add the API key to your `.env` file

## Features Implemented

### ✅ Part 1: Review Submission Form
- [x] React component with all required form elements
- [x] Optional name input
- [x] University dropdown (Wits, UJ, UP)
- [x] Dynamic course dropdown based on university selection
- [x] Review text area with character limits
- [x] Submit button with proper validation

### ✅ Part 2: Perspective API Integration
- [x] Asynchronous form submission handling
- [x] Review text sent to Perspective API for analysis
- [x] Conditional logic for high toxicity scores
- [x] Polite rejection messages for inappropriate content
- [x] Data preparation for storage (currently logs to console)

### ✅ Part 3: Reviews Display
- [x] Course reviews display component
- [x] Integration ready for course cards
- [x] Dynamic review population
- [x] Beautiful UI with safety indicators

## Usage Examples

### Basic Form Usage
```tsx
import CourseReviewForm from './components/CourseReviewForm';

function MyPage() {
  return (
    <div>
      <h1>Leave a Review</h1>
      <CourseReviewForm />
    </div>
  );
}
```

### Reviews Display Usage
```tsx
import CourseReviewsDisplay from './components/CourseReviewsDisplay';

function CourseCard({ university, course }) {
  return (
    <div>
      <h2>{course}</h2>
      <CourseReviewsDisplay 
        university={university}
        course={course}
        onAddReview={() => setShowReviewForm(true)}
      />
    </div>
  );
}
```

## Next Steps (Future Implementation)

### Database Integration
1. Set up Supabase database with `course_reviews` table
2. Replace mock functions in `CourseReviewService.ts`
3. Implement real API calls for CRUD operations

### Course Card Integration
1. Import `CourseReviewsDisplay` into existing course card components
2. Add review sections to course result pages
3. Implement review submission modals

### Advanced Features
1. Review rating system
2. Review helpfulness voting
3. Review moderation dashboard
4. Email notifications for new reviews

## Testing the System

1. **Start the development server**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Navigate to the demo page**:
   - Add route to `CourseReviewDemo` in your router
   - Or import and use components directly

3. **Test the form**:
   - Select different universities
   - Verify course options update dynamically
   - Submit reviews with various content
   - Test toxicity detection (requires API key)

4. **Test the display**:
   - Switch between different courses
   - Verify reviews display correctly
   - Test pagination and show more/less functionality

## Troubleshooting

### Perspective API Issues
- Ensure API key is correctly set in `.env`
- Check API quota and billing status
- Verify API is enabled in Google Cloud Console

### Form Validation Issues
- Check browser console for errors
- Verify all required fields are filled
- Ensure review text meets minimum length requirements

### Styling Issues
- Ensure Tailwind CSS is properly configured
- Check that all UI components are imported correctly
- Verify dark mode compatibility if using theme switching

## Security Considerations

- **API Key Protection**: Never commit API keys to version control
- **Content Moderation**: All reviews are analyzed before approval
- **Input Validation**: Form inputs are validated on both client and server
- **Rate Limiting**: Consider implementing rate limiting for review submissions

## Performance Notes

- **Lazy Loading**: Reviews are loaded on-demand
- **Pagination**: Large numbers of reviews are paginated
- **Caching**: Consider implementing review caching for frequently accessed courses
- **API Optimization**: Batch API calls where possible

## Contributing

When adding new features to the review system:
1. Maintain the existing component structure
2. Follow the established naming conventions
3. Add proper TypeScript types
4. Include error handling
5. Test with various input scenarios
6. Update this documentation

## Support

For issues or questions about the course review system:
1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Test with the demo page first
4. Review the component props and interfaces
5. Check the service layer for API issues
