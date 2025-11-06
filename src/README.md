# DeepKlarity Technologies - AI Wiki Quiz Generator

An intelligent web application that automatically generates quizzes from Wikipedia articles using AI (Large Language Models). Built with React frontend and designed to integrate with a Python backend (FastAPI/Django).

## 🎯 Features

### Tab 1: Generate Quiz
- **URL Input**: Enter any Wikipedia article URL
- **Automatic Processing**: Backend scrapes article content and generates quiz using LLM
- **Comprehensive Display**:
  - Article summary
  - Key entities (people, organizations, locations)
  - Article sections
  - 5-10 quiz questions with multiple choice options
  - Difficulty levels (easy, medium, hard)
  - Explanations for each answer
  - Related topics for further reading
- **Quiz Modes**:
  - **View Mode**: See all questions with answers and explanations
  - **Take Quiz Mode**: Interactive quiz with answer submission and scoring
- **Caching**: Prevents duplicate processing of the same URL

### Tab 2: Past Quizzes (History)
- Table view of all previously generated quizzes
- Sortable by date created
- Click "Details" to view full quiz in modal
- Persistent storage in database

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────┐
│  React Frontend │ ───► │  Python Backend  │ ───► │   LLM API   │
│   (This App)    │      │ FastAPI/Django   │      │   (Gemini)  │
└─────────────────┘      └──────────────────┘      └─────────────┘
         │                        │
         │                        │
         ▼                        ▼
┌─────────────────┐      ┌──────────────────┐
│    Supabase     │      │  PostgreSQL DB   │
│  (PostgreSQL)   │      │   (Your choice)  │
└─────────────────┘      └──────────────────┘
```

### Frontend (This Application)
- **Framework**: React with TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Hooks
- **API Integration**: Ready to connect to Python backend

### Backend (To Be Implemented)
- **Framework**: FastAPI or Django (Python)
- **Web Scraping**: BeautifulSoup
- **LLM Integration**: LangChain + Gemini API (or other free tier LLM)
- **Database**: PostgreSQL or MySQL

## 🚀 Quick Start

### Frontend Setup (This Application)

The frontend is already deployed and running! It includes:
- Complete UI with tab navigation
- Mock data for testing
- Database integration with Supabase
- Ready-to-connect API endpoints

### Backend Setup (Required)

You need to implement and deploy the Python backend:

1. **Use the template**: See `/sample_data/backend_example.py`

2. **Install dependencies**:
```bash
pip install -r sample_data/requirements.txt
```

3. **Set environment variables**:
```bash
export GEMINI_API_KEY="your-api-key-here"
export DATABASE_URL="postgresql://user:password@localhost/dbname"
```

4. **Implement the backend**:
   - Complete the `scrape_wikipedia()` function
   - Implement LLM integration in `generate_quiz_with_llm()`
   - Add database storage functions
   - Deploy to a server (e.g., Railway, Render, AWS)

5. **Update frontend configuration**:
   - Open `/lib/api.ts`
   - Replace `YOUR_PYTHON_BACKEND_URL_HERE` with your deployed backend URL

## 📁 Project Structure

```
/
├── App.tsx                          # Main application component
├── components/
│   ├── GenerateQuiz.tsx            # Tab 1: Generate quiz UI
│   ├── QuizDisplay.tsx             # Quiz display with view/take modes
│   ├── QuizHistory.tsx             # Tab 2: History table
│   ├── QuizDetailsModal.tsx        # Modal for viewing quiz details
│   └── ui/                         # shadcn/ui components
├── lib/
│   ├── api.ts                      # API functions & backend integration
│   └── types.ts                    # TypeScript type definitions
├── utils/
│   └── supabase/                   # Supabase client configuration
├── sample_data/
│   ├── alan_turing_response.json   # Sample quiz data
│   ├── marie_curie_response.json   # Sample quiz data
│   ├── backend_example.py          # Python backend template
│   ├── requirements.txt            # Python dependencies
│   ├── database_schema.sql         # Database schema
│   └── sample_urls.md              # Test URLs
└── README.md                       # This file
```

## 🔌 API Endpoints (Backend)

Your Python backend should implement these endpoints:

### `POST /generate-quiz`
Generate quiz from Wikipedia URL

**Request**:
```json
{
  "url": "https://en.wikipedia.org/wiki/Alan_Turing"
}
```

**Response**: See sample data in `/sample_data/alan_turing_response.json`

### `GET /quizzes`
Get all quizzes from database

**Response**: Array of quiz objects

### `GET /quiz/{quiz_id}`
Get specific quiz by ID

**Response**: Single quiz object

## 🧪 Testing

### Test Wikipedia URLs
See `/sample_data/sample_urls.md` for a list of tested URLs covering:
- Technology & Computer Science
- Science & Mathematics
- History
- Geography & Nature
- Arts & Literature

### Sample API Responses
- `/sample_data/alan_turing_response.json`
- `/sample_data/marie_curie_response.json`

## 🎨 UI Components Used

- **Tabs**: Main navigation between Generate and History views
- **Cards**: Display quiz content in organized sections
- **Tables**: Show history of quizzes
- **Dialogs**: Modal for viewing quiz details
- **Badges**: Display difficulty levels, entities, topics
- **Buttons**: Actions and mode switching
- **Input**: URL entry field
- **Alerts**: Error messages and notifications

## 📊 Database Schema

The Supabase database uses a key-value store for quiz data. For your Python backend, see `/sample_data/database_schema.sql` for a complete relational schema.

### Key Tables:
- `quizzes`: Main quiz metadata
- `quiz_content`: JSON data for entities, sections, topics
- `questions`: Individual quiz questions
- `article_cache`: (Optional) Store scraped HTML for reference

## 🎓 LLM Prompt Design

### Quiz Generation Prompt Template

The LLM prompt should be designed to:

1. **Ground responses in article content**: Avoid hallucinations
2. **Generate diverse questions**: Mix difficulty levels
3. **Provide clear explanations**: Reference specific sections
4. **Suggest related topics**: Real Wikipedia article titles

See `/sample_data/backend_example.py` for a detailed prompt template example.

### Key Prompt Engineering Principles:
- Be specific about output format (JSON)
- Request factual questions only
- Require section references in explanations
- Set temperature low (0.3) for consistency
- Include examples in few-shot prompting

## ✅ Evaluation Checklist

### Functionality
- [x] Accepts Wikipedia URL input
- [x] Frontend UI with two tabs
- [x] Quiz display with all required fields
- [x] History view with details modal
- [x] Take Quiz mode with scoring
- [ ] Backend scraping (to be implemented)
- [ ] LLM integration (to be implemented)
- [ ] Database storage (to be implemented)

### Code Quality
- [x] Modular component structure
- [x] TypeScript type safety
- [x] Error handling in UI
- [x] Clear code organization
- [ ] Backend error handling (to be implemented)

### UI/UX
- [x] Clean, minimal design
- [x] Responsive layout
- [x] Loading states
- [x] Error messages
- [x] Interactive quiz mode

### Bonus Features
- [x] Take Quiz mode with scoring
- [x] Caching (URL duplication check)
- [x] Card-based layout
- [x] Difficulty badges
- [ ] Section-wise question grouping (optional)
- [ ] Raw HTML storage (optional)

## 🔐 Environment Variables

### Frontend (Supabase - Already Configured)
- `SUPABASE_URL`: Provided by Figma Make
- `SUPABASE_ANON_KEY`: Provided by Figma Make

### Backend (You Need to Set)
- `GEMINI_API_KEY`: Your Gemini API key
- `DATABASE_URL`: Your PostgreSQL/MySQL connection string

## 📝 Next Steps

1. **Implement Python Backend**:
   - Use `/sample_data/backend_example.py` as starting point
   - Implement web scraping with BeautifulSoup
   - Integrate LangChain + Gemini API
   - Set up database (PostgreSQL/MySQL)

2. **Deploy Backend**:
   - Deploy to Railway, Render, or AWS
   - Set environment variables
   - Test endpoints

3. **Connect Frontend**:
   - Update `PYTHON_BACKEND_URL` in `/lib/api.ts`
   - Test end-to-end flow
   - Remove mock data generation

4. **Test & Iterate**:
   - Test with various Wikipedia URLs
   - Refine LLM prompts
   - Improve quiz quality
   - Handle edge cases

## 🤝 Support

For questions or issues:
- Frontend: Check this README and inline code comments
- Backend: See `/sample_data/backend_example.py` template
- API Documentation: See "API Endpoints" section above

## 📄 License

This project is created for DeepKlarity Technologies.
