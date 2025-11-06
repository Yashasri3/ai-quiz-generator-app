# Quick Start Guide

Get started with the DeepKlarity Wiki Quiz Generator in 5 minutes!

## Frontend (Already Running! ✅)

The frontend is **already deployed and functional**. You can start using it right now with mock data:

1. **Open the application** (you're probably already here!)
2. **Go to "Generate Quiz" tab**
3. **Enter a Wikipedia URL**: 
   ```
   https://en.wikipedia.org/wiki/Alan_Turing
   ```
4. **Click "Generate Quiz"**
5. **Explore the features**:
   - View the generated quiz
   - Switch to "Take Quiz" mode
   - Check "Past Quizzes" tab

> **Note**: Currently using mock data. Follow steps below to connect real Python backend.

---

## Backend Setup (15 Minutes)

### Step 1: Get the Template (1 min)

The backend template is already in your project:
```
/sample_data/backend_example.py
```

### Step 2: Install Python Dependencies (3 min)

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r sample_data/requirements.txt
```

### Step 3: Get Gemini API Key (3 min)

1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

### Step 4: Set Environment Variables (1 min)

Create a `.env` file:
```bash
GEMINI_API_KEY=your_api_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/wiki_quiz_db
```

### Step 5: Implement Core Functions (5 min)

Edit `backend_example.py`:

1. **Complete `scrape_wikipedia()` function**
2. **Implement `generate_quiz_with_llm()` with Gemini**
3. **Add database save function**

See code comments in the file for guidance.

### Step 6: Test Locally (2 min)

```bash
# Start server
python backend_example.py

# Test in browser
open http://localhost:8000/docs
```

---

## Connect Frontend to Backend (1 Minute)

### Step 1: Deploy Backend

Quick deploy options:
- **Railway**: `railway init && railway up` (Recommended)
- **Render**: Connect GitHub repo
- **Local**: Use ngrok for testing

### Step 2: Update Frontend Config

Edit `/lib/api.ts` line 48:

```typescript
// Change this:
const PYTHON_BACKEND_URL = 'YOUR_PYTHON_BACKEND_URL_HERE';

// To your deployed URL:
const PYTHON_BACKEND_URL = 'https://your-app.railway.app';
```

### Step 3: Test!

1. Open the frontend
2. Enter: `https://en.wikipedia.org/wiki/Marie_Curie`
3. Click "Generate Quiz"
4. Verify real data appears (not mock)

---

## Quick Test Checklist

- [ ] Frontend loads properly
- [ ] Can enter Wikipedia URL
- [ ] Mock quiz generates and displays
- [ ] Can switch between View/Take modes
- [ ] Quiz History tab shows quizzes
- [ ] Details modal opens
- [ ] Backend deployed and responding
- [ ] Real quiz generation works end-to-end

---

## Troubleshooting

### "Failed to fetch" error
- Check backend is running
- Verify CORS is enabled in backend
- Check backend URL is correct in `/lib/api.ts`

### "Invalid Wikipedia URL" error
- Ensure URL starts with `https://en.wikipedia.org/wiki/`
- Check URL format is correct

### Backend not generating quiz
- Verify Gemini API key is set
- Check API quota/limits
- Review backend logs for errors
- Test scraping function separately

### Database connection failed
- Check DATABASE_URL format
- Verify database is running
- Test connection with `psql` or SQL client

---

## Sample URLs to Test

Try these Wikipedia articles:

**Easy to process**:
- https://en.wikipedia.org/wiki/Python_(programming_language)
- https://en.wikipedia.org/wiki/Moon
- https://en.wikipedia.org/wiki/Coffee

**Complex articles**:
- https://en.wikipedia.org/wiki/Alan_Turing
- https://en.wikipedia.org/wiki/Marie_Curie
- https://en.wikipedia.org/wiki/World_War_II

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `/App.tsx` | Main application component |
| `/lib/api.ts` | **UPDATE BACKEND URL HERE** |
| `/sample_data/backend_example.py` | Backend template to implement |
| `/sample_data/requirements.txt` | Python dependencies |
| `/sample_data/database_schema.sql` | Database schema |

---

## Need More Help?

- **Setup Instructions**: See `SETUP_GUIDE.md`
- **Backend Integration**: See `BACKEND_INTEGRATION.md`
- **Testing**: See `TESTING.md`
- **Full Documentation**: See `README.md`

---

## What's Working Now

✅ **Frontend**:
- Complete UI with two tabs
- Quiz display with all features
- View/Take quiz modes
- Database integration (Supabase)
- Error handling
- Responsive design

⏳ **Backend**:
- Template provided
- Structure defined
- API endpoints specified
- Ready for implementation

---

## Next Actions

### For Testing (Now)
1. Explore the frontend interface
2. Test with mock data
3. Try View and Take Quiz modes
4. Check Quiz History

### For Production (After Backend Setup)
1. Implement Python backend
2. Deploy to hosting service
3. Update frontend config
4. Test with real Wikipedia URLs
5. Gather sample data
6. Take screenshots

---

## Timeline Estimate

- **Frontend Review**: 10 minutes (it's done!)
- **Backend Implementation**: 2-3 hours
- **Testing & Refinement**: 1-2 hours
- **Documentation & Screenshots**: 30 minutes
- **Total**: ~4-6 hours

---

## Success Criteria

You'll know it's working when:

1. ✅ Enter a Wikipedia URL
2. ✅ Click "Generate Quiz"
3. ✅ Real quiz appears (not mock data)
4. ✅ Quiz is relevant to the article
5. ✅ Quiz saves to database
6. ✅ Appears in "Past Quizzes" tab
7. ✅ Can take quiz and get scored

---

## Pro Tips

💡 **Start Simple**: Test with short, simple Wikipedia articles first

💡 **Use Mock Data**: The frontend works with mock data - perfect for UI development

💡 **Check Logs**: Always monitor backend logs for debugging

💡 **Test Prompts**: Spend time refining your LLM prompts for better quiz quality

💡 **Cache Everything**: The app already prevents duplicate URL processing

💡 **Monitor Costs**: LLM APIs can cost money - use free tiers wisely

---

## Quick Command Reference

```bash
# Backend
python backend_example.py                    # Start server
pip install -r requirements.txt              # Install deps
uvicorn main:app --reload                    # Alternative start

# Database
psql -d wiki_quiz_db                         # Connect to DB
psql -f database_schema.sql                  # Run schema

# Testing
curl http://localhost:8000/                  # Test health
curl -X POST http://localhost:8000/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{"url": "..."}'                        # Test generation

# Deploy
railway init && railway up                   # Deploy to Railway
```

---

## Resources

- **Gemini API**: https://ai.google.dev/
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **LangChain**: https://python.langchain.com/
- **BeautifulSoup**: https://www.crummy.com/software/BeautifulSoup/
- **Railway**: https://railway.app/
- **Render**: https://render.com/

---

**Ready to build?** Start with implementing the backend using `/sample_data/backend_example.py`! 🚀
