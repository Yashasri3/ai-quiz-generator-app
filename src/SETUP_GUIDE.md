# Setup Guide - DeepKlarity Wiki Quiz Generator

This guide will help you set up both the frontend (already deployed) and the backend (requires implementation).

## Frontend Setup ✅ (Already Complete)

The frontend is already deployed and running in Figma Make with:
- React + TypeScript
- shadcn/ui components
- Supabase database integration
- Mock data for testing

**No additional setup required for frontend!**

## Backend Setup 🛠️ (Required Implementation)

### Step 1: Environment Setup

1. **Install Python 3.9+**
   ```bash
   python --version  # Should be 3.9 or higher
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r sample_data/requirements.txt
   ```

### Step 2: Get API Keys

#### Gemini API (Recommended - Free Tier)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy your API key

#### Alternative LLM Options
- **OpenAI**: https://platform.openai.com/api-keys
- **Anthropic Claude**: https://console.anthropic.com/
- **Cohere**: https://dashboard.cohere.com/api-keys

### Step 3: Database Setup

#### Option A: PostgreSQL (Recommended)

1. **Install PostgreSQL**
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql`
   - Windows: Download from postgresql.org

2. **Create database**
   ```sql
   createdb wiki_quiz_db
   ```

3. **Run schema**
   ```bash
   psql -d wiki_quiz_db -f sample_data/database_schema.sql
   ```

4. **Get connection string**
   ```
   postgresql://username:password@localhost:5432/wiki_quiz_db
   ```

#### Option B: Supabase (Managed PostgreSQL)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > Database
4. Copy connection string
5. Run schema in SQL Editor

#### Option C: MySQL

1. **Install MySQL**
   ```bash
   brew install mysql  # macOS
   sudo apt-get install mysql-server  # Ubuntu
   ```

2. **Create database**
   ```sql
   CREATE DATABASE wiki_quiz_db;
   ```

3. **Update schema** (replace SERIAL with AUTO_INCREMENT, JSONB with JSON)

### Step 4: Configure Environment Variables

Create a `.env` file in your backend directory:

```bash
# LLM API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/wiki_quiz_db

# Optional
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

### Step 5: Implement Backend

Use `/sample_data/backend_example.py` as your starting point.

#### Key Functions to Implement:

1. **Web Scraping** (`scrape_wikipedia`)
   ```python
   from bs4 import BeautifulSoup
   import requests
   
   def scrape_wikipedia(url: str) -> Dict:
       # Fetch page
       response = requests.get(url)
       soup = BeautifulSoup(response.content, 'html.parser')
       
       # Extract title, content, sections
       # Return structured data
   ```

2. **LLM Integration** (`generate_quiz_with_llm`)
   ```python
   from langchain_google_genai import ChatGoogleGenerativeAI
   from langchain.prompts import PromptTemplate
   
   def generate_quiz_with_llm(article_data: Dict):
       llm = ChatGoogleGenerativeAI(
           model="gemini-pro",
           google_api_key=os.getenv("GEMINI_API_KEY")
       )
       
       # Create prompt
       # Generate quiz
       # Parse response
   ```

3. **Database Operations**
   ```python
   from sqlalchemy import create_engine
   
   def save_quiz_to_db(quiz_data: QuizResponse):
       # Insert into database
       # Handle transactions
   ```

### Step 6: Test Locally

1. **Start the server**
   ```bash
   python backend_example.py
   # Or with uvicorn:
   uvicorn backend_example:app --reload
   ```

2. **Test endpoints**
   ```bash
   # Test root endpoint
   curl http://localhost:8000/
   
   # Test quiz generation
   curl -X POST http://localhost:8000/generate-quiz \
     -H "Content-Type: application/json" \
     -d '{"url": "https://en.wikipedia.org/wiki/Alan_Turing"}'
   ```

3. **Check API documentation**
   - Open browser to http://localhost:8000/docs
   - FastAPI auto-generates interactive API docs

### Step 7: Deploy Backend

#### Option A: Railway (Recommended)

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repo or deploy from CLI
4. Add environment variables
5. Deploy
6. Copy deployment URL

#### Option B: Render

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect repository
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables
7. Deploy

#### Option C: AWS EC2

1. Launch EC2 instance
2. SSH into instance
3. Install Python, PostgreSQL
4. Clone repository
5. Set up environment
6. Use nginx + gunicorn for production
7. Configure security groups

### Step 8: Connect Frontend to Backend

1. **Get your backend URL**
   - Example: `https://your-app.railway.app`

2. **Update frontend configuration**
   - Open `/lib/api.ts`
   - Find line: `const PYTHON_BACKEND_URL = 'YOUR_PYTHON_BACKEND_URL_HERE';`
   - Replace with: `const PYTHON_BACKEND_URL = 'https://your-app.railway.app';`

3. **Remove mock data** (optional)
   - In `/lib/api.ts`, remove the `generateMockQuizData()` fallback
   - Let real errors show during development

### Step 9: Testing End-to-End

1. **Open the frontend application**
2. **Go to "Generate Quiz" tab**
3. **Enter a Wikipedia URL**:
   ```
   https://en.wikipedia.org/wiki/Alan_Turing
   ```
4. **Click "Generate Quiz"**
5. **Verify**:
   - Quiz is generated
   - Data is saved to database
   - Quiz appears in "Past Quizzes" tab

### Step 10: Monitor and Debug

#### Check Logs

**Backend logs**:
```bash
# Railway/Render: Check deployment logs in dashboard
# Local: Terminal where uvicorn is running
```

**Frontend logs**:
```javascript
// Open browser console (F12)
// Look for network requests and errors
```

#### Common Issues

**1. CORS Errors**
```python
# In backend, ensure CORS is enabled:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specific frontend domain
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**2. Database Connection Failed**
- Check DATABASE_URL format
- Verify database is running
- Test connection with psql or SQL client

**3. LLM API Errors**
- Verify API key is correct
- Check rate limits
- Monitor API usage in provider dashboard

**4. Scraping Blocked**
- Add User-Agent header
- Respect robots.txt
- Handle rate limiting

## Troubleshooting

### Backend won't start
- Check Python version
- Verify all dependencies installed
- Check for syntax errors
- Ensure port 8000 is available

### Database connection fails
- Verify DATABASE_URL format
- Check database is running
- Test connection separately
- Check firewall settings

### LLM returns errors
- Verify API key
- Check quota/credits
- Test with simple prompt
- Review error messages

### Frontend can't reach backend
- Check CORS configuration
- Verify backend URL is correct
- Check network tab in browser
- Ensure backend is deployed and running

## Next Steps

After setup is complete:
1. Test with multiple Wikipedia URLs
2. Refine LLM prompts for better quiz quality
3. Implement additional features (caching, validation)
4. Monitor performance and costs
5. Add analytics and logging

## Resources

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **LangChain Docs**: https://python.langchain.com/
- **BeautifulSoup Docs**: https://www.crummy.com/software/BeautifulSoup/
- **Gemini API Docs**: https://ai.google.dev/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
