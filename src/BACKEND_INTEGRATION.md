# Backend Integration Guide

This document provides detailed guidance on integrating the Python backend with the React frontend.

## Overview

The frontend is ready and waiting for your Python backend. This guide explains how they communicate and what you need to implement.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│                                                          │
│  ┌──────────────┐      ┌──────────────┐                │
│  │ GenerateQuiz │ ───► │   API Layer  │                │
│  │  Component   │      │  (/lib/api)  │                │
│  └──────────────┘      └──────────────┘                │
│                              │                           │
└──────────────────────────────┼──────────────────────────┘
                               │ HTTP Request
                               ▼
                    ┌──────────────────────┐
                    │   Python Backend     │
                    │   (FastAPI/Django)   │
                    │                      │
                    │  POST /generate-quiz │
                    │  GET  /quizzes       │
                    │  GET  /quiz/{id}     │
                    └──────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
         ┌──────────┐   ┌─────────┐   ┌──────────┐
         │Wikipedia │   │   LLM   │   │ Database │
         │ Scraping │   │   API   │   │PostgreSQL│
         └──────────┘   └─────────┘   └──────────┘
```

## Frontend API Layer

Location: `/lib/api.ts`

### Key Functions

#### 1. `generateQuizFromUrl(url: string)`

**Purpose**: Calls your Python backend to generate a quiz

**Current Implementation**:
```typescript
export async function generateQuizFromUrl(url: string): Promise<QuizData> {
  const PYTHON_BACKEND_URL = 'YOUR_PYTHON_BACKEND_URL_HERE'; // Update this!
  
  const response = await fetch(`${PYTHON_BACKEND_URL}/generate-quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  return await response.json();
}
```

**What You Need to Do**:
1. Deploy your Python backend
2. Replace `'YOUR_PYTHON_BACKEND_URL_HERE'` with your actual backend URL
3. Example: `'https://my-quiz-api.railway.app'`

#### 2. `saveQuiz(quizData)`

**Purpose**: Saves quiz to Supabase database

**Current Implementation**: Already working ✅
- Uses Supabase KV store
- Automatically generates unique IDs
- Stores complete quiz data as JSON

#### 3. `getAllQuizzes()`

**Purpose**: Retrieves all quizzes from database

**Current Implementation**: Already working ✅
- Queries Supabase
- Returns array of quiz objects
- Used by Quiz History tab

## Backend Requirements

Your Python backend must implement these endpoints:

### 1. POST `/generate-quiz`

**Request**:
```json
{
  "url": "https://en.wikipedia.org/wiki/Alan_Turing"
}
```

**Response** (must match this structure):
```json
{
  "id": 1,
  "url": "https://en.wikipedia.org/wiki/Alan_Turing",
  "title": "Alan Turing",
  "summary": "Brief summary...",
  "key_entities": {
    "people": ["Alan Turing", "Alonzo Church"],
    "organizations": ["University of Cambridge", "Bletchley Park"],
    "locations": ["United Kingdom", "Manchester"]
  },
  "sections": ["Early life", "Career", "Legacy"],
  "quiz": [
    {
      "question": "Where did Alan Turing study?",
      "options": ["Harvard", "Cambridge", "Oxford", "Princeton"],
      "answer": "Cambridge",
      "difficulty": "easy",
      "explanation": "Mentioned in the 'Early life' section."
    }
  ],
  "related_topics": ["Cryptography", "Enigma machine"]
}
```

**Implementation Steps**:

1. **Validate URL**
   ```python
   if 'wikipedia.org/wiki/' not in url:
       raise HTTPException(400, "Invalid Wikipedia URL")
   ```

2. **Scrape Wikipedia**
   ```python
   def scrape_wikipedia(url: str) -> Dict:
       response = requests.get(url)
       soup = BeautifulSoup(response.content, 'html.parser')
       
       # Extract title
       title = soup.find('h1', class_='firstHeading').text
       
       # Extract paragraphs
       content_div = soup.find('div', class_='mw-parser-output')
       paragraphs = [p.get_text() for p in content_div.find_all('p')]
       
       # Extract sections
       sections = [h.find('span', class_='mw-headline').text 
                   for h in content_div.find_all(['h2', 'h3'])]
       
       return {
           'title': title,
           'content': ' '.join(paragraphs[:10]),
           'sections': sections
       }
   ```

3. **Generate Quiz with LLM**
   ```python
   def generate_quiz_with_llm(article_data: Dict) -> Dict:
       from langchain_google_genai import ChatGoogleGenerativeAI
       from langchain.prompts import PromptTemplate
       
       llm = ChatGoogleGenerativeAI(
           model="gemini-pro",
           google_api_key=os.getenv("GEMINI_API_KEY"),
           temperature=0.3
       )
       
       prompt = PromptTemplate(
           input_variables=["title", "content", "sections"],
           template="""
           Generate a quiz based on this Wikipedia article about {title}.
           
           Content: {content}
           Sections: {sections}
           
           Return JSON with:
           1. summary (2-3 sentences)
           2. key_entities (people, organizations, locations)
           3. quiz (5-10 questions, each with question, 4 options, answer, difficulty, explanation)
           4. related_topics (5-10 Wikipedia topics)
           
           Requirements:
           - Questions must be factual
           - Mix difficulty levels
           - Explanations must reference sections
           - No hallucinations
           """
       )
       
       result = llm.invoke(prompt.format(**article_data))
       return parse_llm_response(result)
   ```

4. **Store in Database**
   ```python
   def save_to_database(quiz_data: Dict):
       # Insert into PostgreSQL
       # See database_schema.sql for structure
   ```

### 2. GET `/quizzes` (Optional)

If you want to use your own database instead of Supabase:

**Response**:
```json
[
  {
    "id": 1,
    "url": "...",
    "title": "...",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### 3. GET `/quiz/{id}` (Optional)

**Response**: Same structure as POST `/generate-quiz`

## Integration Steps

### Step 1: Test Backend Locally

```bash
# Start your backend
python backend.py

# Test with curl
curl -X POST http://localhost:8000/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{"url": "https://en.wikipedia.org/wiki/Alan_Turing"}'
```

### Step 2: Deploy Backend

Deploy to Railway, Render, or AWS:

```bash
# Example: Railway
railway init
railway up
railway open  # Get your URL
```

### Step 3: Update Frontend

Edit `/lib/api.ts`:

```typescript
// Change this line:
const PYTHON_BACKEND_URL = 'YOUR_PYTHON_BACKEND_URL_HERE';

// To your deployed URL:
const PYTHON_BACKEND_URL = 'https://your-app.railway.app';
```

### Step 4: Test End-to-End

1. Open frontend application
2. Enter Wikipedia URL
3. Click "Generate Quiz"
4. Check browser console for errors
5. Verify quiz appears correctly

## Error Handling

### Backend Errors

Your backend should return errors in this format:

```json
{
  "detail": "Error message here"
}
```

The frontend will display these errors to the user.

### Frontend Error Handling

Already implemented in `/components/GenerateQuiz.tsx`:

```typescript
try {
  const quiz = await generateQuizFromUrl(url);
  // Success
} catch (err) {
  setError(err.message);
  // Error displayed to user
}
```

## CORS Configuration

**CRITICAL**: Your backend must enable CORS

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, use specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Response Time Optimization

Quiz generation can be slow. Consider:

1. **Add timeout warnings**:
   ```typescript
   // Frontend shows "This may take 30-60 seconds..."
   ```

2. **Use streaming responses** (advanced):
   ```python
   from fastapi.responses import StreamingResponse
   ```

3. **Cache aggressively**:
   ```python
   # Check if URL already processed
   cached = db.query(Quiz).filter_by(url=url).first()
   if cached:
       return cached
   ```

## Testing Checklist

- [ ] Backend responds to POST `/generate-quiz`
- [ ] Response matches expected JSON structure
- [ ] All required fields are present
- [ ] Quiz array contains valid questions
- [ ] CORS headers are set correctly
- [ ] Errors are handled gracefully
- [ ] Frontend can reach backend
- [ ] Data appears correctly in UI
- [ ] Quiz History shows saved quizzes
- [ ] Details modal works

## Common Issues

### 1. Network Error

**Problem**: `Failed to fetch`

**Solutions**:
- Check backend is running
- Verify URL is correct
- Check CORS configuration
- Look at browser console Network tab

### 2. Invalid Response Format

**Problem**: Frontend displays incorrect data

**Solutions**:
- Verify backend response structure
- Check JSON field names match exactly
- Use TypeScript types for validation

### 3. Database Connection Failed

**Problem**: Backend can't save quiz

**Solutions**:
- Check DATABASE_URL
- Verify database is running
- Test connection with psql

### 4. LLM Timeout

**Problem**: Request takes too long

**Solutions**:
- Increase timeout limits
- Add loading states
- Implement caching
- Use faster LLM model

## Advanced Features

### Caching

Already implemented in frontend:

```typescript
const existingQuiz = await checkUrlExists(url);
if (existingQuiz) {
  setQuizData(existingQuiz);
  setIsCached(true);
  return;
}
```

### Validation

Backend should validate:
- URL format
- Wikipedia domain
- Article exists (not 404)
- Content length (min/max)

### Rate Limiting

Prevent abuse:

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/generate-quiz")
@limiter.limit("5/minute")
async def generate_quiz(...):
    ...
```

## Monitoring

### Backend Logs

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/generate-quiz")
async def generate_quiz(request):
    logger.info(f"Processing URL: {request.url}")
    # ...
    logger.info(f"Quiz generated successfully")
```

### Frontend Logs

Already implemented with console.error:

```typescript
console.error('Error generating quiz:', err);
```

## Support

If you encounter issues:

1. Check browser console (F12)
2. Check backend logs
3. Verify API response format
4. Test backend endpoints with Postman/curl
5. Review this documentation

## Example Implementation

See `/sample_data/backend_example.py` for a complete template with:
- FastAPI setup
- CORS configuration
- Request/response models
- Scraping function
- LLM integration placeholder
- Database operations placeholder
- Error handling

Follow the TODO comments to implement each section.
