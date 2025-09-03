import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

const API_KEY = process.env.GOOGLE_PERSPECTIVE_API_KEY;
const API_URL = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';

async function testGoogleAPI() {
  if (!API_KEY) {
    console.log('❌ No API key found. Please set GOOGLE_PERSPECTIVE_API_KEY in your .env file');
    return;
  }

  console.log('🔍 Testing Google Perspective API...');
  console.log('🔑 API Key exists:', !!API_KEY);
  console.log('🔑 API Key starts with:', API_KEY.substring(0, 10) + '...');

  const testText = "This is a test message to check if the API works.";
  
  const requestData = {
    comment: {
      text: testText
    },
    requestedAttributes: {
      TOXICITY: {},
      SEVERE_TOXICITY: {},
      IDENTITY_ATTACK: {},
      INSULT: {},
      PROFANITY: {},
      THREAT: {},
      SEXUALLY_EXPLICIT: {}
    }
  };

  try {
    console.log('📤 Sending request to Google API...');
    
    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log('✅ API Response received!');
    console.log('📊 Status:', response.status);
    console.log('📊 Data:', JSON.stringify(response.data, null, 2));
    
    // Extract and display scores
    if (response.data.attributeScores) {
      console.log('\n🎯 Toxicity Scores:');
      Object.keys(response.data.attributeScores).forEach(key => {
        const score = response.data.attributeScores[key].summaryScore.value;
        console.log(`  ${key}: ${(score * 100).toFixed(1)}%`);
      });
    }

  } catch (error) {
    console.error('❌ API Error:', error.message);
    
    if (error.response) {
      console.error('📊 Response Status:', error.response.status);
      console.error('📊 Response Data:', error.response.data);
    }
  }
}

// Run the test
testGoogleAPI();
