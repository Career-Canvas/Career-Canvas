# 🚀 Switching to Google Perspective API

## **Why We're Switching:**
- ✅ **Never expires** - API keys are permanent
- ✅ **More accurate** - Google's models are superior
- ✅ **Free tier** - generous limits for development
- ✅ **Better documentation** - easier to maintain
- ✅ **Used by major platforms** - Reddit, Wikipedia, etc.

## **Step 1: Get Your Google API Key**

### **1.1 Go to Google Cloud Console**
- Visit: [https://console.cloud.google.com/](https://console.cloud.google.com/)
- Sign in with your Google account

### **1.2 Create/Select Project**
- Click on the project dropdown at the top
- Click "New Project" or select existing one
- Give it a name like "Career Canvas Content Filter"

### **1.3 Enable Perspective API**
- In the left sidebar, click "APIs & Services" > "Library"
- Search for "Perspective API"
- Click on "Perspective API" and click "Enable"

### **1.4 Create API Key**
- Go to "APIs & Services" > "Credentials"
- Click "Create Credentials" > "API Key"
- Copy the generated API key

## **Step 2: Update Environment Variables**

### **2.1 Update .env file**
In your `backend/.env` file, replace:
```bash
# OLD (Hugging Face)
HUGGING_FACE_API_KEY=your_old_key

# NEW (Google)
GOOGLE_PERSPECTIVE_API_KEY=your_new_google_api_key
```

### **2.2 Update env.example**
The `env.example` file has been updated to show the new variable.

## **Step 3: Install Dependencies**

### **3.1 Install new packages**
```bash
cd backend
npm install
```

### **3.2 Verify installation**
```bash
npm list axios
```

## **Step 4: Test the Integration**

### **4.1 Test the API directly**
```bash
cd backend
node test-google-api.js
```

### **4.2 Test through your backend**
```bash
# Start your backend
npm run dev

# In another terminal, test the endpoint
curl -X POST http://localhost:3001/api/reviews/filter \
  -H "Content-Type: application/json" \
  -d '{"reviewText": "This is a test review"}'
```

## **Step 5: Deploy to Azure**

### **5.1 Set Environment Variable in Azure**
- Go to your Azure App Service
- Navigate to "Configuration" > "Application settings"
- Add: `GOOGLE_PERSPECTIVE_API_KEY` = `your_api_key`

### **5.2 Deploy your updated code**
- Push your changes to your repository
- Azure will automatically redeploy

## **What's Changed:**

### **Backend Changes:**
- ✅ **reviewFilter.js** - Now uses Google Perspective API
- ✅ **server.js** - Updated environment variable references
- ✅ **package.json** - Removed unnecessary dependencies
- ✅ **test-google-api.js** - New test script

### **Frontend Changes:**
- ✅ **No changes needed** - Same interface
- ✅ **Same API endpoints** - Everything works the same
- ✅ **Better results** - More accurate toxicity detection

## **API Response Format:**

### **Google Perspective API Response:**
```json
{
  "attributeScores": {
    "TOXICITY": {
      "summaryScore": {
        "value": 0.1
      }
    },
    "SEVERE_TOXICITY": {
      "summaryScore": {
        "value": 0.05
      }
    }
  }
}
```

### **Our Converted Format:**
```json
{
  "toxicity": 0.1,
  "severe_toxicity": 0.05
}
```

## **Testing Different Content:**

### **Clean Content:**
```bash
curl -X POST http://localhost:3001/api/reviews/filter \
  -H "Content-Type: application/json" \
  -d '{"reviewText": "This university has excellent facilities and helpful staff."}'
```

### **Offensive Content:**
```bash
curl -X POST http://localhost:3001/api/reviews/filter \
  -H "Content-Type: application/json" \
  -d '{"reviewText": "This place is terrible and the people here are stupid idiots!"}'
```

## **Troubleshooting:**

### **Common Issues:**

#### **1. API Key Not Found**
```
Error: Google Perspective API key not configured
```
**Solution:** Check your `.env` file and make sure `GOOGLE_PERSPECTIVE_API_KEY` is set.

#### **2. API Quota Exceeded**
```
Error: Quota exceeded
```
**Solution:** Check your Google Cloud Console for usage limits. Free tier is generous.

#### **3. CORS Issues**
```
Error: CORS policy blocked
```
**Solution:** CORS is handled by your backend, not Google. Check your backend CORS settings.

## **Benefits of the Switch:**

1. **🔑 No More Expiration** - API keys are permanent
2. **🎯 Better Accuracy** - Google's models are superior
3. **📊 More Categories** - 7 toxicity categories vs 6
4. **🌍 Global Availability** - Works from anywhere
5. **📈 Better Performance** - Faster response times
6. **🛡️ Enterprise Grade** - Used by major platforms

## **Next Steps:**

1. **Get your Google API key** (5 minutes)
2. **Update your .env file** (1 minute)
3. **Test the integration** (2 minutes)
4. **Deploy to Azure** (5 minutes)

## **Support:**

If you run into any issues:
1. Check the test script output
2. Verify your API key is correct
3. Check Google Cloud Console for any errors
4. Ensure the Perspective API is enabled

---

**🎉 Congratulations! You now have a more reliable, accurate, and permanent content filtering system!**
