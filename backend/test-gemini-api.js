import axios from 'axios';

// Test the Gemini API key that's hardcoded in the frontend
const GEMINI_API_KEY = "AIzaSyAWHvDx2wyRVwYyuTuqenEvioc3JsVKSjE";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

async function testGeminiAPI() {
  console.log('🔍 Testing Gemini API...');
  console.log('🔑 API Key exists:', !!GEMINI_API_KEY);
  console.log('🔑 API Key starts with:', GEMINI_API_KEY.substring(0, 10) + '...');

  const testPrompt = "Hello! Can you give me a brief response?";
  
  const requestData = {
    contents: [
      {
        role: "user",
        parts: [{ text: testPrompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 100,
      topP: 0.8,
      topK: 40
    }
  };

  try {
    console.log('📤 Sending request to Gemini API...');
    console.log('📝 Test prompt:', testPrompt);
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    console.log('✅ Gemini API Response received!');
    console.log('📊 Status:', response.status);
    
    if (response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content) {
      const responseText = response.data.candidates[0].content.parts[0].text;
      console.log('🤖 AI Response:', responseText);
      console.log('✅ Gemini API is working correctly!');
    } else {
      console.log('⚠️ Unexpected response format:', JSON.stringify(response.data, null, 2));
    }

  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    
    if (error.response) {
      console.error('📊 Response Status:', error.response.status);
      console.error('📊 Response Data:', error.response.data);
      
      if (error.response.status === 429) {
        console.error('🚫 Rate limit exceeded! This explains the HTTP 429 errors.');
        console.error('💡 Consider implementing better rate limiting or using a different API key.');
      } else if (error.response.status === 403) {
        console.error('🚫 API key might be invalid or have insufficient permissions.');
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timed out. The API might be slow or overloaded.');
    }
  }
}

// Run the test
testGeminiAPI();
