# Testing Guide - DeepKlarity Wiki Quiz Generator

This document provides comprehensive testing instructions for the application.

## Frontend Testing (Can Test Now)

### Test 1: UI Navigation

**Steps**:
1. Open the application
2. Verify header displays "DeepKlarity Technologies" and "AI Wiki Quiz Generator"
3. Check that two tabs are visible: "Generate Quiz" and "Past Quizzes"
4. Click each tab and verify content switches

**Expected Result**: ✅ Smooth tab navigation with proper content display

---

### Test 2: URL Input Validation

**Steps**:
1. Go to "Generate Quiz" tab
2. Click "Generate Quiz" without entering a URL
3. Verify error message: "Please enter a Wikipedia URL"
4. Enter an invalid URL: `https://google.com`
5. Click "Generate Quiz"
6. Verify error message: "Please enter a valid Wikipedia URL"

**Expected Result**: ✅ Proper validation errors displayed

---

### Test 3: Generate Quiz (Mock Data)

**Steps**:
1. Enter a valid Wikipedia URL: `https://en.wikipedia.org/wiki/Alan_Turing`
2. Click "Generate Quiz"
3. Wait for loading spinner
4. Verify quiz data appears below:
   - Article title and URL link
   - Summary text
   - Key entities (people, organizations, locations)
   - Article sections
   - Quiz questions with options
   - Related topics

**Expected Result**: ✅ Mock quiz data displays correctly (until backend is connected)

---

### Test 4: View vs Take Quiz Mode

**Steps**:
1. Generate a quiz (using mock data)
2. By default, "View Mode" should be active
3. Verify all answers and explanations are visible
4. Click "Take Quiz" button
5. Verify answers and explanations are hidden
6. Click on answer options
7. Verify selected answers are highlighted
8. Select an answer for all questions
9. Click "Submit Quiz"
10. Verify score is displayed
11. Verify correct/incorrect answers are shown
12. Click "Try Again"
13. Verify quiz resets

**Expected Result**: ✅ Interactive quiz mode works correctly

---

### Test 5: Quiz History (Empty State)

**Steps**:
1. Fresh database - go to "Past Quizzes" tab
2. Verify empty state message: "No quizzes generated yet."
3. Verify helpful text: "Go to the 'Generate Quiz' tab to create your first quiz."

**Expected Result**: ✅ Proper empty state display

---

### Test 6: Quiz History (With Data)

**Steps**:
1. Generate at least 2 quizzes
2. Go to "Past Quizzes" tab
3. Verify table displays:
   - Title column
   - URL column (truncated, clickable)
   - Questions count badge
   - Date created
   - Details button
4. Click external URL link - should open Wikipedia in new tab
5. Click "Details" button
6. Verify modal opens with full quiz display
7. Close modal

**Expected Result**: ✅ History table and modal work correctly

---

### Test 7: Caching

**Steps**:
1. Generate a quiz for: `https://en.wikipedia.org/wiki/Marie_Curie`
2. Wait for quiz to appear
3. Enter the SAME URL again
4. Click "Generate Quiz"
5. Verify alert message: "This quiz was loaded from cache..."
6. Verify quiz appears instantly (no backend call)

**Expected Result**: ✅ Caching prevents duplicate processing

---

### Test 8: Responsive Design

**Steps**:
1. Open application on desktop
2. Resize browser window to tablet size (768px)
3. Resize to mobile size (375px)
4. Verify layout adjusts appropriately
5. Test all features on mobile size

**Expected Result**: ✅ Responsive layout works on all screen sizes

---

## Backend Testing (After Implementation)

### Test 9: Backend Health Check

**Command**:
```bash
curl http://localhost:8000/
```

**Expected Response**:
```json
{
  "message": "DeepKlarity Wiki Quiz Generator API",
  "version": "1.0.0",
  "status": "active"
}
```

---

### Test 10: Wikipedia Scraping

**Command**:
```bash
curl -X POST http://localhost:8000/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{"url": "https://en.wikipedia.org/wiki/Alan_Turing"}'
```

**Expected Response**: JSON object matching the structure in `/sample_data/alan_turing_response.json`

**Verify**:
- `title` matches Wikipedia article title
- `summary` is 2-3 sentences
- `sections` array contains actual article sections
- `key_entities` extracted correctly
- `quiz` array has 5-10 questions
- Each question has 4 options
- `difficulty` is "easy", "medium", or "hard"
- `explanation` references article sections
- `related_topics` are valid Wikipedia topics

---

### Test 11: Invalid URL Handling

**Test Cases**:

1. **Non-Wikipedia URL**
   ```bash
   curl -X POST http://localhost:8000/generate-quiz \
     -H "Content-Type: application/json" \
     -d '{"url": "https://google.com"}'
   ```
   **Expected**: 400 error with message "Invalid Wikipedia URL"

2. **Non-existent Article**
   ```bash
   curl -X POST http://localhost:8000/generate-quiz \
     -H "Content-Type: application/json" \
     -d '{"url": "https://en.wikipedia.org/wiki/ThisArticleDoesNotExist123456"}'
   ```
   **Expected**: 404 error or appropriate error message

3. **Malformed URL**
   ```bash
   curl -X POST http://localhost:8000/generate-quiz \
     -H "Content-Type: application/json" \
     -d '{"url": "not-a-valid-url"}'
   ```
   **Expected**: 400 error with validation message

---

### Test 12: LLM Integration

**Verify**:
1. Questions are factually correct (check against article)
2. No hallucinated information
3. Options are plausible and distinct
4. Correct answer is actually in the article
5. Explanation references specific sections
6. Difficulty levels are appropriate:
   - Easy: Basic facts from introduction
   - Medium: Requires reading specific sections
   - Hard: Nuanced or less prominent information

---

### Test 13: Database Storage

**Test A: Check Data Saved**
```sql
SELECT * FROM quizzes ORDER BY created_at DESC LIMIT 1;
```
Verify most recent quiz is stored correctly

**Test B: Check Caching**
1. Generate quiz for a URL
2. Generate same URL again
3. Verify database query returns cached data
4. Verify scraping doesn't happen twice

---

### Test 14: End-to-End Flow

**Steps**:
1. Open frontend application
2. Enter: `https://en.wikipedia.org/wiki/Marie_Curie`
3. Click "Generate Quiz"
4. Wait for processing (should show loading state)
5. Verify quiz appears with real data (not mock)
6. Go to "Past Quizzes" tab
7. Verify new quiz appears in table
8. Click "Details" to view in modal
9. Switch to "Take Quiz" mode
10. Complete quiz and submit
11. Verify score calculation

**Expected Result**: ✅ Complete flow works from URL input to quiz completion

---

## Test URLs

Use these Wikipedia URLs for comprehensive testing:

### Simple Articles (Good for initial testing)
- https://en.wikipedia.org/wiki/Python_(programming_language)
- https://en.wikipedia.org/wiki/Coffee
- https://en.wikipedia.org/wiki/Moon

### Complex Articles (Test robustness)
- https://en.wikipedia.org/wiki/World_War_II (long, many sections)
- https://en.wikipedia.org/wiki/Quantum_mechanics (technical content)
- https://en.wikipedia.org/wiki/United_States (very long, complex)

### Edge Cases
- https://en.wikipedia.org/wiki/E (very short article)
- https://en.wikipedia.org/wiki/List_of_lists_of_lists (meta article)
- https://en.wikipedia.org/wiki/Wikipedia:Unusual_articles (unique format)

---

## Performance Testing

### Test 15: Response Time

**Measure**:
1. Time from clicking "Generate Quiz" to quiz appearing
2. Database query time for history
3. LLM API response time

**Targets**:
- Scraping: < 5 seconds
- LLM generation: < 30 seconds
- Database save: < 1 second
- Total: < 45 seconds

### Test 16: Concurrent Users

**Test**:
1. Simulate 10 users generating quizzes simultaneously
2. Check for race conditions
3. Verify database integrity
4. Monitor API rate limits

---

## Quiz Quality Testing

### Test 17: Question Quality

**Criteria**:
1. **Factual Accuracy**: Verify against Wikipedia article
2. **Difficulty Distribution**: Mix of easy (40%), medium (40%), hard (20%)
3. **Option Plausibility**: All options should seem reasonable
4. **No Duplicates**: Questions should be unique
5. **Coverage**: Questions should cover different sections

**Manual Review Process**:
1. Generate quiz for well-known topic (e.g., Alan Turing)
2. Read the Wikipedia article
3. Answer each quiz question
4. Verify your answers match the provided answers
5. Check explanations reference correct sections
6. Rate question quality 1-5

---

### Test 18: Entity Extraction

**Verify**:
1. Key people mentioned in article are extracted
2. Organizations are correctly identified
3. Locations are accurate
4. No irrelevant entities included

**Example** (Alan Turing):
- ✅ People: Alan Turing, Alonzo Church, John von Neumann
- ✅ Organizations: Bletchley Park, University of Cambridge
- ✅ Locations: United Kingdom, Manchester
- ❌ Should NOT include: Generic terms, non-entities

---

### Test 19: Related Topics

**Verify**:
1. Topics are related to article subject
2. Topics are actual Wikipedia article titles
3. Topics provide learning paths
4. No duplicate topics

**Test**: Click suggested topics to verify they exist

---

## Error Handling Testing

### Test 20: Network Errors

**Simulate**:
1. Disconnect internet
2. Try to generate quiz
3. Verify error message displayed
4. Reconnect and retry

### Test 21: Backend Unavailable

**Simulate**:
1. Stop backend server
2. Try to generate quiz
3. Verify graceful error message
4. Frontend doesn't crash

### Test 22: Invalid API Responses

**Simulate**:
1. Backend returns malformed JSON
2. Backend returns incomplete data
3. Backend returns wrong data types

**Verify**: Frontend handles gracefully with error messages

---

## Regression Testing

After making changes, run these quick tests:

### Quick Regression Checklist
- [ ] Generate quiz with new URL
- [ ] Generate quiz with cached URL
- [ ] View quiz history
- [ ] Open quiz details modal
- [ ] Take quiz and submit
- [ ] Check responsive design
- [ ] Verify no console errors

---

## Automated Testing (Advanced)

### Sample Test Cases

**Frontend (Jest + React Testing Library)**:
```typescript
// Example test structure
describe('GenerateQuiz Component', () => {
  it('shows error for invalid URL', () => {
    render(<GenerateQuiz />);
    fireEvent.change(input, { target: { value: 'invalid' } });
    fireEvent.click(button);
    expect(screen.getByText(/invalid/i)).toBeInTheDocument();
  });
});
```

**Backend (pytest)**:
```python
def test_scrape_wikipedia():
    url = "https://en.wikipedia.org/wiki/Alan_Turing"
    result = scrape_wikipedia(url)
    assert result['title'] == 'Alan Turing'
    assert len(result['sections']) > 0

def test_generate_quiz():
    response = client.post("/generate-quiz", json={"url": "..."})
    assert response.status_code == 200
    data = response.json()
    assert 'quiz' in data
    assert len(data['quiz']) >= 5
```

---

## User Acceptance Testing

### Test Scenario 1: Teacher Creating Quiz

**Persona**: High school teacher preparing for class

**Steps**:
1. Choose a topic from curriculum (e.g., "Industrial Revolution")
2. Find Wikipedia article
3. Generate quiz
4. Review questions for appropriateness
5. Use "Take Quiz" mode to preview student experience

**Success Criteria**:
- Quiz generated in < 1 minute
- Questions are grade-appropriate
- No errors or confusing content

---

### Test Scenario 2: Student Self-Study

**Persona**: College student studying for exam

**Steps**:
1. Generate quiz on study topic
2. Take quiz in "Take Quiz" mode
3. Review explanations for incorrect answers
4. Click related topics for further reading
5. Retake quiz to improve score

**Success Criteria**:
- Engaging quiz experience
- Clear explanations help learning
- Score tracking motivates improvement

---

## Test Data

Sample quiz data available in:
- `/sample_data/alan_turing_response.json`
- `/sample_data/marie_curie_response.json`

Sample URLs in:
- `/sample_data/sample_urls.md`

---

## Bug Reporting Template

When reporting issues:

```
**URL Tested**: 
**Expected Behavior**: 
**Actual Behavior**: 
**Steps to Reproduce**:
1. 
2. 
3. 

**Screenshots**: 
**Browser Console Errors**: 
**Backend Logs**: 
```

---

## Testing Checklist Summary

### Frontend Only (No Backend Required)
- [x] UI navigation
- [x] Input validation
- [x] Mock data display
- [x] View/Take quiz modes
- [x] Quiz history empty state
- [x] Responsive design

### Backend Integration Required
- [ ] Real quiz generation
- [ ] Wikipedia scraping accuracy
- [ ] LLM quality
- [ ] Database storage
- [ ] Caching
- [ ] Error handling
- [ ] Performance benchmarks
- [ ] End-to-end flow

### Quality Assurance
- [ ] Question accuracy
- [ ] Entity extraction
- [ ] Related topics relevance
- [ ] Difficulty distribution
- [ ] Explanation quality

---

## Next Steps After Testing

1. Document any bugs found
2. Refine LLM prompts based on quiz quality
3. Optimize performance bottlenecks
4. Add analytics to track usage
5. Gather user feedback
6. Iterate on UI/UX improvements
