# Screenshots Guide

This document outlines what screenshots you need to take for your submission.

## Required Screenshots

### 1. Generate Quiz Page - Initial State

**What to capture**: 
- Tab navigation showing "Generate Quiz" selected
- URL input field (empty)
- "Generate Quiz" button
- Empty area below where quiz will appear

**How to take**:
1. Open the application
2. Ensure "Generate Quiz" tab is selected
3. Clear any URL from input field
4. Take full-page screenshot

**Filename**: `01_generate_quiz_initial.png`

---

### 2. Generate Quiz - URL Entered

**What to capture**:
- URL input field with a Wikipedia URL entered
- Example: `https://en.wikipedia.org/wiki/Alan_Turing`
- "Generate Quiz" button ready to click

**How to take**:
1. Enter: `https://en.wikipedia.org/wiki/Alan_Turing`
2. Don't click the button yet
3. Take screenshot

**Filename**: `02_url_entered.png`

---

### 3. Generate Quiz - Loading State

**What to capture**:
- Loading spinner
- "Generating..." text on button
- URL input disabled

**How to take**:
1. Click "Generate Quiz"
2. Quickly take screenshot during loading
3. May need to try a few times to capture

**Filename**: `03_loading_state.png`

---

### 4. Quiz Generated - View Mode (Part 1: Top)

**What to capture**:
- Article title
- Wikipedia URL link
- "View Mode" button selected
- Summary section
- Key Entities section (people, organizations, locations)

**How to take**:
1. Wait for quiz to generate
2. Scroll to top
3. Capture header and entity sections

**Filename**: `04_quiz_view_mode_top.png`

---

### 5. Quiz Generated - View Mode (Part 2: Questions)

**What to capture**:
- At least 2-3 complete quiz questions
- Question text
- Four options (A-D)
- Correct answer badge/highlight
- Difficulty badge (easy/medium/hard)
- Explanation section

**How to take**:
1. Scroll to questions section
2. Capture 2-3 complete questions with all details

**Filename**: `05_quiz_view_mode_questions.png`

---

### 6. Quiz Generated - View Mode (Part 3: Bottom)

**What to capture**:
- Last question
- Article sections list
- Related topics badges
- Complete card layout

**How to take**:
1. Scroll to bottom of quiz
2. Capture sections and related topics

**Filename**: `06_quiz_view_mode_bottom.png`

---

### 7. Quiz - Take Quiz Mode (Interactive)

**What to capture**:
- "Take Quiz" button selected
- Questions without visible answers/explanations
- Some options selected (highlighted)
- "Submit Quiz" button visible (if all answered)

**How to take**:
1. Click "Take Quiz" button
2. Select answers for several questions
3. Capture interactive state

**Filename**: `07_take_quiz_mode.png`

---

### 8. Quiz Submitted - Score Display

**What to capture**:
- Score alert/banner at top
- Example: "Quiz Complete! You scored 6 out of 8 (75%)"
- Correct answers highlighted in green
- Incorrect answers highlighted in red
- Explanations now visible

**How to take**:
1. After selecting all answers
2. Click "Submit Quiz"
3. Capture result with score and highlighted answers

**Filename**: `08_quiz_submitted_score.png`

---

### 9. Past Quizzes Tab - With Data

**What to capture**:
- "Past Quizzes" tab selected
- Table with multiple quiz entries
- Columns: Title, URL, Questions, Date Created, Actions
- "Details" buttons visible

**How to take**:
1. Generate 3-4 different quizzes first
2. Click "Past Quizzes" tab
3. Capture full table

**Filename**: `09_quiz_history_table.png`

---

### 10. Past Quizzes - Details Modal

**What to capture**:
- Modal overlay showing quiz details
- Full quiz displayed inside modal
- "X" close button
- Modal dialog styling

**How to take**:
1. In "Past Quizzes" tab
2. Click "Details" button on any quiz
3. Capture modal (may need to scroll to show more content)

**Filename**: `10_quiz_details_modal.png`

---

### 11. Past Quizzes - Empty State

**What to capture**:
- "Past Quizzes" tab selected
- Empty state message: "No quizzes generated yet"
- Helpful text about generating first quiz

**How to take**:
1. Clear database (or use fresh environment)
2. Go to "Past Quizzes" tab
3. Capture empty state

**Filename**: `11_history_empty_state.png`

---

### 12. Error Handling - Invalid URL

**What to capture**:
- Error alert message
- Red error styling
- Message: "Please enter a valid Wikipedia URL"

**How to take**:
1. Enter invalid URL: `https://google.com`
2. Click "Generate Quiz"
3. Capture error message

**Filename**: `12_error_invalid_url.png`

---

### 13. Caching Alert

**What to capture**:
- Alert message: "This quiz was loaded from cache"
- Quiz displayed below
- Shows duplicate URL was detected

**How to take**:
1. Generate a quiz with a URL
2. Enter the SAME URL again
3. Click "Generate Quiz"
4. Capture caching alert

**Filename**: `13_cached_quiz_alert.png`

---

### 14. Responsive Design - Mobile View

**What to capture**:
- Application on mobile screen size (375px width)
- Tab navigation adapted for mobile
- Quiz cards stacked properly
- Buttons and text readable

**How to take**:
1. Open browser DevTools (F12)
2. Toggle device toolbar
3. Select iPhone or mobile device
4. Capture quiz generation page

**Filename**: `14_mobile_responsive.png`

---

### 15. Complete End-to-End Flow

**What to capture**:
- Side-by-side comparison or collage showing:
  - URL input → Quiz generated → History view → Details modal

**How to take**:
1. Use screenshot editing tool
2. Combine multiple screenshots
3. Show complete user journey

**Filename**: `15_complete_flow.png`

---

## Bonus Screenshots (Optional)

### 16. Different Difficulty Levels

**What to capture**:
- Questions with different difficulty badges
- Easy (secondary badge color)
- Medium (default badge color)
- Hard (destructive/red badge color)

**Filename**: `bonus_difficulty_levels.png`

---

### 17. Different Wikipedia Topics

**What to capture**:
- Quizzes from various topics
- Science, History, Technology, etc.
- Shows versatility of the system

**Filename**: `bonus_various_topics.png`

---

### 18. Backend API Response (Postman/curl)

**What to capture**:
- API testing tool (Postman, Insomnia, or terminal)
- POST request to `/generate-quiz`
- JSON response body
- Status 200 OK

**Filename**: `bonus_api_response.png`

---

### 19. Database Content

**What to capture**:
- Database GUI or SQL query results
- Shows stored quiz data
- Demonstrates persistence

**Filename**: `bonus_database_content.png`

---

## Screenshot Checklist

Before submitting, ensure you have:

- [ ] All 15 required screenshots
- [ ] High resolution (at least 1920x1080 for desktop)
- [ ] Clear, readable text
- [ ] No personal information visible
- [ ] Consistent browser/theme
- [ ] Proper filenames
- [ ] Organized in a folder

---

## Tools for Taking Screenshots

### Built-in Tools
- **Windows**: Windows + Shift + S
- **Mac**: Cmd + Shift + 4
- **Linux**: Print Screen or Screenshot tool

### Browser Tools
- **Chrome DevTools**: Device toolbar for responsive
- **Full Page Screenshots**: Extensions available

### Professional Tools
- **Snagit**: Paid, feature-rich
- **Greenshot**: Free, Windows
- **Skitch**: Free, Mac
- **Lightshot**: Free, cross-platform

---

## Editing Screenshots

### Recommended Edits
1. **Crop**: Remove unnecessary browser chrome
2. **Annotate**: Add arrows/highlights for key features
3. **Combine**: Create flow diagrams
4. **Resize**: Optimize file sizes

### Tools
- **Mac**: Preview
- **Windows**: Paint, Paint 3D
- **Cross-platform**: GIMP, Photopea (web)

---

## Screenshot Organization

Organize screenshots in a folder:

```
screenshots/
├── 01_generate_quiz_initial.png
├── 02_url_entered.png
├── 03_loading_state.png
├── 04_quiz_view_mode_top.png
├── 05_quiz_view_mode_questions.png
├── 06_quiz_view_mode_bottom.png
├── 07_take_quiz_mode.png
├── 08_quiz_submitted_score.png
├── 09_quiz_history_table.png
├── 10_quiz_details_modal.png
├── 11_history_empty_state.png
├── 12_error_invalid_url.png
├── 13_cached_quiz_alert.png
├── 14_mobile_responsive.png
├── 15_complete_flow.png
└── bonus/
    ├── bonus_difficulty_levels.png
    ├── bonus_various_topics.png
    ├── bonus_api_response.png
    └── bonus_database_content.png
```

---

## Tips for Great Screenshots

### Do's ✅
- Use consistent browser window size
- Clear any unrelated browser tabs
- Ensure good contrast (light mode recommended)
- Show complete UI elements
- Include relevant context
- Use real data (not Lorem Ipsum)

### Don'ts ❌
- Don't include personal information
- Don't crop important UI elements
- Don't use low resolution
- Don't show browser console errors (unless demonstrating)
- Don't capture loading failures

---

## Verification Checklist

Review each screenshot:

- [ ] Image is clear and readable
- [ ] Text is not blurry
- [ ] Colors are accurate
- [ ] No sensitive data visible
- [ ] Filename matches content
- [ ] File size reasonable (< 5MB)
- [ ] Format is PNG or JPG

---

## Adding to Documentation

Include screenshots in your README or documentation:

```markdown
## Screenshots

### Generate Quiz Page
![Generate Quiz](screenshots/01_generate_quiz_initial.png)

### Quiz Display
![Quiz Display](screenshots/04_quiz_view_mode_top.png)

### Quiz History
![Quiz History](screenshots/09_quiz_history_table.png)
```

---

## Submission Format

When submitting:

1. **Create a folder**: `screenshots/`
2. **Add all screenshots**: Numbered and named
3. **Include README**: Brief description of each
4. **Compress if needed**: ZIP file for email submission
5. **Test links**: If submitting via shared drive

---

## Questions to Address with Screenshots

Your screenshots should answer:

1. ✅ What does the initial interface look like?
2. ✅ How do users generate a quiz?
3. ✅ What information is displayed in the quiz?
4. ✅ How does the interactive quiz mode work?
5. ✅ Where can users see their quiz history?
6. ✅ How are errors handled?
7. ✅ Is the design responsive?
8. ✅ What's the complete user flow?

---

## Sample Screenshot Descriptions

Include brief descriptions:

```
01_generate_quiz_initial.png
- Initial state of the Generate Quiz tab
- Shows URL input field and generate button
- Clean, minimal interface

04_quiz_view_mode_top.png
- Quiz displayed in View Mode
- Shows article title, summary, and key entities
- Demonstrates comprehensive information extraction

09_quiz_history_table.png
- Past Quizzes tab with multiple entries
- Table shows quiz metadata and actions
- Demonstrates data persistence
```

---

## Need Help?

If you're having trouble capturing specific screenshots:

1. Check if the feature is working correctly
2. Review component code for the feature
3. Test in different browsers
4. Clear cache and try again
5. Refer to TESTING.md for feature testing steps

---

**Ready to capture?** Follow this guide systematically and you'll have comprehensive documentation of your application! 📸
