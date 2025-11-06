# Contributing to DeepKlarity Wiki Quiz Generator

Thank you for your interest in contributing to this project! This document provides guidelines for extending and improving the application.

## Project Structure

Understanding the codebase will help you contribute effectively.

### Frontend Architecture

```
/components/
  ├── GenerateQuiz.tsx      # Main quiz generation interface
  ├── QuizDisplay.tsx       # Reusable quiz display component
  ├── QuizHistory.tsx       # History table with data fetching
  └── QuizDetailsModal.tsx  # Modal wrapper for quiz display

/lib/
  ├── api.ts               # All API calls and data operations
  └── types.ts             # TypeScript interfaces

/utils/
  └── supabase/            # Database client configuration
```

### Backend Architecture (To Implement)

```
/sample_data/
  └── backend_example.py   # FastAPI template with structure
```

## How to Contribute

### 1. Frontend Improvements

#### Adding New UI Features

**Example: Add quiz filtering**

1. **Update types** (`/lib/types.ts`):
```typescript
export interface QuizFilter {
  difficulty?: 'easy' | 'medium' | 'hard';
  topic?: string;
  dateRange?: { start: Date; end: Date };
}
```

2. **Create filter component** (`/components/QuizFilter.tsx`):
```typescript
export function QuizFilter({ onFilterChange }) {
  // Filter UI and logic
}
```

3. **Update QuizHistory** to use filters:
```typescript
const [filters, setFilters] = useState<QuizFilter>({});
const filteredQuizzes = quizzes.filter(/* filter logic */);
```

#### Improving Existing Components

**Example: Enhance quiz scoring**

Edit `/components/QuizDisplay.tsx`:
```typescript
const calculateDetailedScore = () => {
  return {
    total: quizData.quiz.length,
    correct: correctAnswers,
    easy: countByDifficulty('easy'),
    medium: countByDifficulty('medium'),
    hard: countByDifficulty('hard'),
    percentage: (correct / total) * 100
  };
};
```

### 2. Backend Enhancements

#### Improving LLM Prompts

The quality of generated quizzes depends heavily on prompt design.

**Current Prompt Structure**:
```python
prompt = """
Generate a quiz based on this Wikipedia article about {title}.

Content: {content}
Sections: {sections}

Return JSON with:
1. summary (2-3 sentences)
2. key_entities (people, organizations, locations)
3. quiz (5-10 questions...)
"""
```

**Improvements to Try**:

1. **Add Examples** (Few-shot learning):
```python
prompt = """
Here are examples of good questions:

Example 1:
Question: "When was Alan Turing born?"
Options: ["1910", "1912", "1914", "1916"]
Answer: "1912"
Difficulty: "easy"
Explanation: "Mentioned in the 'Early life' section: Alan Turing was born on 23 June 1912."

Now generate questions for: {title}
"""
```

2. **Add Constraints**:
```python
prompt = """
Requirements:
- Questions MUST be answerable from the article
- Do NOT include information not in the article
- Options should be plausible but distinct
- Cite specific section for each explanation
- Avoid yes/no questions
- Mix factual and analytical questions
"""
```

3. **Section-Specific Questions**:
```python
# Generate 2 questions per major section
for section in major_sections:
    prompt = f"""
    Generate 2 questions specifically about the '{section}' section.
    Section content: {section_content}
    """
```

#### Adding Entity Extraction

Improve entity extraction with NLP libraries:

```python
import spacy

nlp = spacy.load("en_core_web_sm")

def extract_entities(text: str) -> KeyEntities:
    doc = nlp(text)
    
    people = [ent.text for ent in doc.ents if ent.label_ == "PERSON"]
    organizations = [ent.text for ent in doc.ents if ent.label_ == "ORG"]
    locations = [ent.text for ent in doc.ents if ent.label_ == "GPE"]
    
    return KeyEntities(
        people=list(set(people))[:10],
        organizations=list(set(organizations))[:10],
        locations=list(set(locations))[:10]
    )
```

#### Implementing Caching

Add Redis for better caching:

```python
import redis
import json

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def get_cached_quiz(url: str) -> Optional[QuizResponse]:
    cached = redis_client.get(f"quiz:{url}")
    if cached:
        return QuizResponse(**json.loads(cached))
    return None

def cache_quiz(url: str, quiz: QuizResponse):
    redis_client.setex(
        f"quiz:{url}",
        86400,  # 24 hours
        json.dumps(quiz.dict())
    )
```

### 3. Database Improvements

#### Adding User Accounts

1. **Create users table**:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE quizzes ADD COLUMN user_id INTEGER REFERENCES users(id);
```

2. **Update frontend to track users**:
```typescript
const user = await getCurrentUser();
const quiz = await saveQuiz({ ...quizData, userId: user.id });
```

#### Adding Quiz Analytics

Track quiz performance:

```sql
CREATE TABLE quiz_analytics (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES quizzes(id),
    total_attempts INTEGER DEFAULT 0,
    average_score DECIMAL(5,2),
    completion_rate DECIMAL(5,2),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Frontend component:
```typescript
export function QuizAnalytics({ quizId }: { quizId: number }) {
  const [analytics, setAnalytics] = useState(null);
  
  useEffect(() => {
    fetchAnalytics(quizId).then(setAnalytics);
  }, [quizId]);
  
  return (
    <Card>
      <h3>Quiz Performance</h3>
      <p>Average Score: {analytics.averageScore}%</p>
      <p>Total Attempts: {analytics.totalAttempts}</p>
    </Card>
  );
}
```

### 4. New Features

#### Feature: Export Quiz as PDF

**Backend** (using ReportLab):
```python
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

@app.get("/quiz/{quiz_id}/export")
async def export_quiz_pdf(quiz_id: int):
    quiz = get_quiz_by_id(quiz_id)
    
    pdf_buffer = io.BytesIO()
    c = canvas.Canvas(pdf_buffer, pagesize=letter)
    
    # Add title
    c.drawString(100, 750, f"Quiz: {quiz.title}")
    
    # Add questions
    y_position = 700
    for i, q in enumerate(quiz.quiz):
        c.drawString(100, y_position, f"{i+1}. {q.question}")
        y_position -= 20
        for option in q.options:
            c.drawString(120, y_position, f"○ {option}")
            y_position -= 15
        y_position -= 10
    
    c.save()
    pdf_buffer.seek(0)
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=quiz_{quiz_id}.pdf"}
    )
```

**Frontend**:
```typescript
const exportPDF = async (quizId: number) => {
  const response = await fetch(`${BACKEND_URL}/quiz/${quizId}/export`);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quiz_${quizId}.pdf`;
  a.click();
};
```

#### Feature: Quiz Sharing

Generate shareable links:

**Backend**:
```python
import secrets

@app.post("/quiz/{quiz_id}/share")
async def create_share_link(quiz_id: int):
    share_token = secrets.token_urlsafe(16)
    
    # Store in database
    await db.execute(
        "INSERT INTO share_links (quiz_id, token, expires_at) VALUES ($1, $2, $3)",
        quiz_id, share_token, datetime.now() + timedelta(days=7)
    )
    
    return {"share_url": f"https://yourapp.com/shared/{share_token}"}

@app.get("/shared/{token}")
async def get_shared_quiz(token: str):
    quiz_id = await db.fetchval(
        "SELECT quiz_id FROM share_links WHERE token = $1 AND expires_at > NOW()",
        token
    )
    if not quiz_id:
        raise HTTPException(404, "Link expired or invalid")
    
    return await get_quiz(quiz_id)
```

**Frontend**:
```typescript
export function ShareQuizButton({ quizId }: { quizId: number }) {
  const [shareUrl, setShareUrl] = useState('');
  
  const handleShare = async () => {
    const response = await fetch(`${BACKEND_URL}/quiz/${quizId}/share`, {
      method: 'POST'
    });
    const data = await response.json();
    setShareUrl(data.share_url);
    
    // Copy to clipboard
    navigator.clipboard.writeText(data.share_url);
    toast.success('Share link copied to clipboard!');
  };
  
  return (
    <Button onClick={handleShare}>
      <Share className="mr-2 size-4" />
      Share Quiz
    </Button>
  );
}
```

### 5. Testing Contributions

#### Adding Unit Tests

**Frontend** (Jest + React Testing Library):

```typescript
// components/__tests__/QuizDisplay.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizDisplay } from '../QuizDisplay';

describe('QuizDisplay', () => {
  const mockQuizData = {
    // ... mock data
  };
  
  it('renders quiz title', () => {
    render(<QuizDisplay quizData={mockQuizData} />);
    expect(screen.getByText(mockQuizData.title)).toBeInTheDocument();
  });
  
  it('switches between view and take mode', () => {
    render(<QuizDisplay quizData={mockQuizData} showTakeQuizMode />);
    
    const takeButton = screen.getByText('Take Quiz');
    fireEvent.click(takeButton);
    
    expect(screen.queryByText('Correct Answer')).not.toBeInTheDocument();
  });
  
  it('calculates score correctly', () => {
    render(<QuizDisplay quizData={mockQuizData} showTakeQuizMode />);
    
    // Select answers
    // Submit quiz
    // Check score
  });
});
```

**Backend** (pytest):

```python
# tests/test_quiz_generation.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_generate_quiz_valid_url():
    response = client.post(
        "/generate-quiz",
        json={"url": "https://en.wikipedia.org/wiki/Python_(programming_language)"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "quiz" in data
    assert len(data["quiz"]) >= 5
    assert all("question" in q for q in data["quiz"])

def test_generate_quiz_invalid_url():
    response = client.post(
        "/generate-quiz",
        json={"url": "https://google.com"}
    )
    assert response.status_code == 400
    assert "Invalid Wikipedia URL" in response.json()["detail"]

def test_scraping_accuracy():
    url = "https://en.wikipedia.org/wiki/Alan_Turing"
    result = scrape_wikipedia(url)
    assert result["title"] == "Alan Turing"
    assert "mathematician" in result["content"].lower()
    assert len(result["sections"]) > 5
```

### 6. Performance Optimization

#### Frontend Optimization

1. **Lazy Loading**:
```typescript
import { lazy, Suspense } from 'react';

const QuizHistory = lazy(() => import('./components/QuizHistory'));

<Suspense fallback={<Loader />}>
  <QuizHistory />
</Suspense>
```

2. **Memoization**:
```typescript
const quizScore = useMemo(() => calculateScore(), [userAnswers, quizData]);
```

3. **Debouncing**:
```typescript
const debouncedSearch = useDebounce(searchTerm, 300);
```

#### Backend Optimization

1. **Database Indexing**:
```sql
CREATE INDEX idx_quizzes_created_at ON quizzes(created_at DESC);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
```

2. **Query Optimization**:
```python
# Bad: N+1 query
for quiz in quizzes:
    questions = get_questions(quiz.id)

# Good: Single query with join
quizzes_with_questions = db.query("""
    SELECT q.*, json_agg(qu.*) as questions
    FROM quizzes q
    LEFT JOIN questions qu ON q.id = qu.quiz_id
    GROUP BY q.id
""")
```

3. **Async Processing**:
```python
from fastapi import BackgroundTasks

@app.post("/generate-quiz")
async def generate_quiz(request: GenerateQuizRequest, background_tasks: BackgroundTasks):
    # Quick response
    task_id = create_task()
    
    # Process in background
    background_tasks.add_task(process_quiz, request.url, task_id)
    
    return {"task_id": task_id, "status": "processing"}
```

### 7. Code Style Guidelines

#### TypeScript/React

```typescript
// Use functional components
export function ComponentName() { }

// Use TypeScript interfaces
interface Props {
  quizData: QuizData;
  onSubmit: (score: number) => void;
}

// Use descriptive names
const calculateUserScore = () => { };
const isAnswerCorrect = (answer: string) => { };

// Extract complex logic
const useQuizLogic = (quizData: QuizData) => {
  // Custom hook logic
};
```

#### Python

```python
# Use type hints
def generate_quiz(url: str) -> QuizResponse:
    pass

# Use docstrings
def scrape_wikipedia(url: str) -> Dict[str, Any]:
    """
    Scrape Wikipedia article content.
    
    Args:
        url: Wikipedia article URL
        
    Returns:
        Dictionary containing title, content, and sections
        
    Raises:
        HTTPException: If URL is invalid or article doesn't exist
    """
    pass

# Use descriptive variable names
article_content = extract_content(soup)
quiz_questions = generate_questions(article_content)
```

### 8. Documentation

When adding features, update documentation:

1. **Code Comments**:
```typescript
/**
 * Calculates quiz score based on user answers.
 * 
 * @param userAnswers - Array of user-selected answers
 * @param correctAnswers - Array of correct answers from quiz
 * @returns Score object with correct count and percentage
 */
```

2. **README Updates**:
- Add feature to feature list
- Update architecture diagram if needed
- Add usage examples

3. **API Documentation**:
- Update endpoint descriptions
- Add request/response examples
- Document error codes

### 9. Submitting Contributions

1. **Test Your Changes**:
   - Run all existing tests
   - Add tests for new features
   - Test edge cases

2. **Update Documentation**:
   - Code comments
   - README if needed
   - CHANGELOG entry

3. **Code Review Checklist**:
   - [ ] Code follows style guidelines
   - [ ] Tests added/updated
   - [ ] Documentation updated
   - [ ] No console.log() left in code
   - [ ] Error handling implemented
   - [ ] Performance considered

## Common Issues

### Issue: Frontend can't connect to backend

**Solution**: Check CORS configuration in backend

### Issue: LLM returns poor quality questions

**Solution**: Refine prompts, add examples, reduce temperature

### Issue: Database queries are slow

**Solution**: Add indexes, optimize queries, implement caching

## Resources

- **React Docs**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/
- **FastAPI**: https://fastapi.tiangolo.com/
- **LangChain**: https://python.langchain.com/
- **Tailwind CSS**: https://tailwindcss.com/

## Questions?

If you have questions about contributing, please:
1. Check existing documentation
2. Review code examples in this guide
3. Test your implementation locally
4. Document your approach

---

Thank you for contributing to the DeepKlarity Wiki Quiz Generator! 🎉
