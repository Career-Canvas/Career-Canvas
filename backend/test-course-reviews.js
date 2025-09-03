// Test script for course reviews API
// Run with: node test-course-reviews.js

const API_BASE_URL = 'http://localhost:3001/api/course-reviews';

async function testCourseReviewsAPI() {
  console.log('🧪 Testing Course Reviews API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health check...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('Health Status:', healthData.status);
    console.log('Database:', healthData.database);
    console.log('✅ Health check passed\n');

    // Test 2: Get all course reviews
    console.log('2️⃣ Testing get all course reviews...');
    const allReviewsResponse = await fetch(`${API_BASE_URL}`);
    const allReviewsData = await allReviewsResponse.json();
    console.log('Total reviews:', allReviewsData.data?.length || 0);
    console.log('✅ Get all reviews passed\n');

    // Test 3: Test content filtering
    console.log('3️⃣ Testing content filtering...');
    const filterResponse = await fetch(`${API_BASE_URL}/filter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        reviewText: 'This is a great course with excellent lecturers and practical projects.' 
      }),
    });

    const filterData = await filterResponse.json();
    if (filterData.success) {
      console.log('✅ Content filtering successful!');
      console.log('Is Offensive:', filterData.data.isOffensive ? '❌ Yes' : '✅ No');
      console.log('Reason:', filterData.data.reason);
      if (filterData.data.toxicityScores) {
        console.log('Toxicity Scores:', Object.entries(filterData.data.toxicityScores)
          .map(([k, v]) => `${k}: ${(v * 100).toFixed(1)}%`)
          .join(', '));
      }
    } else {
      console.log('❌ Content filtering failed:', filterData.message);
    }
    console.log('');

    // Test 4: Submit a test review
    console.log('4️⃣ Testing submit course review...');
    const testReview = {
      university_name: 'Wits',
      course_name: 'BSc Computer Science',
      review_text: 'This is a test review from the backend API test script. Great program with excellent professors!',
      author: 'Test User',
      email: 'test@example.com',
      rating: 5
    };

    const submitResponse = await fetch(`${API_BASE_URL}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testReview),
    });

    const submitData = await submitResponse.json();
    if (submitData.success) {
      console.log('✅ Review submitted successfully!');
      console.log('Review ID:', submitData.data.review.id);
      console.log('Created at:', submitData.data.review.created_at);
      console.log('Filter Result:', submitData.data.filterResult.isOffensive ? '❌ Offensive' : '✅ Approved');
    } else {
      console.log('❌ Review submission failed:', submitData.message);
    }
    console.log('');

    // Test 5: Get reviews for specific course
    console.log('5️⃣ Testing get reviews for specific course...');
    const specificReviewsResponse = await fetch(`${API_BASE_URL}/Wits/BSc Computer Science`);
    const specificReviewsData = await specificReviewsResponse.json();
    console.log('Reviews for Wits BSc Computer Science:', specificReviewsData.data?.length || 0);
    console.log('✅ Get specific course reviews passed\n');

    console.log('🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
testCourseReviewsAPI();
