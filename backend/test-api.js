// Simple test script for the review filtering API
// Run with: node test-api.js
import dotenv from 'dotenv';
dotenv.config();

const API_BASE = 'http://localhost:3001/api';

async function testAPI() {
  console.log('🧪 Testing Review Filtering API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await fetch(`${API_BASE}/reviews/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check Result:', healthData.status);
    console.log('');

    // Test 2: Filter Non-offensive Review
    console.log('2️⃣ Testing Non-offensive Review...');
    const goodReview = "This university has excellent facilities and supportive staff. The campus is beautiful and the library is well-stocked.";
    const filterResponse = await fetch(`${API_BASE}/reviews/filter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewText: goodReview })
    });
    const filterData = await filterResponse.json();
    console.log('✅ Filter Result:', filterData.data.isOffensive ? '❌ Flagged' : '✅ Approved');
    console.log('Reason:', filterData.data.reason);
    console.log('');

    // Test 3: Filter Offensive Review
    console.log('3️⃣ Testing Offensive Review...');
    const badReview = "This place is absolutely terrible and the people here are stupid idiots who don't know anything.";
    const badFilterResponse = await fetch(`${API_BASE}/reviews/filter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewText: badReview })
    });
    const badFilterData = await badFilterResponse.json();
    console.log('✅ Filter Result:', badFilterData.data.isOffensive ? '❌ Flagged' : '✅ Approved');
    console.log('Reason:', badFilterData.data.reason);
    if (badFilterData.data.toxicityScores) {
      console.log('Toxicity Scores:', badFilterData.data.toxicityScores);
    }
    console.log('');

    // Test 4: Submit Review
    console.log('4️⃣ Testing Review Submission...');
    const reviewData = {
      reviewText: "Great academic environment with helpful professors and modern facilities.",
      universityName: "Test University",
      category: "Academics",
      rating: 5,
      author: "Test Student"
    };
    
    const submitResponse = await fetch(`${API_BASE}/reviews/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    
    if (submitResponse.ok) {
      const submitData = await submitResponse.json();
      console.log('✅ Review Submitted Successfully!');
      console.log('Review ID:', submitData.data.review.id);
    } else {
      const errorData = await submitResponse.json();
      console.log('❌ Review Submission Failed:', errorData.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testAPI();
}

export { testAPI };
