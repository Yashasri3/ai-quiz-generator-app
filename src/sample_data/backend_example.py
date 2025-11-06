"""
DeepKlarity Technologies - AI Wiki Quiz Generator Backend
Python Backend Example using FastAPI

This is a template for the Python backend that you need to implement.
The frontend is already configured to call this backend.

Requirements:
- FastAPI or Django
- BeautifulSoup for web scraping
- LangChain for LLM integration
- Database: PostgreSQL or MySQL
- LLM: Gemini API (free tier) or any other free tier API

Setup Instructions:
1. Install dependencies: pip install -r requirements.txt
2. Set your API keys in environment variables
3. Update the database connection string
4. Deploy this backend to a server
5. Update PYTHON_BACKEND_URL in /lib/api.ts with your deployment URL
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import List, Dict, Optional
import os
from bs4 import BeautifulSoup
import requests

# Uncomment these imports when implementing
# from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain.prompts import PromptTemplate
# from langchain.chains import LLMChain

app = FastAPI(title="DeepKlarity Wiki Quiz Generator API")

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class GenerateQuizRequest(BaseModel):
    url: HttpUrl

class KeyEntities(BaseModel):
    people: List[str]
    organizations: List[str]
    locations: List[str]

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    answer: str
    difficulty: str
    explanation: str

class QuizResponse(BaseModel):
    id: int
    url: str
    title: str
    summary: str
    key_entities: KeyEntities
    sections: List[str]
    quiz: List[QuizQuestion]
    related_topics: List[str]


def scrape_wikipedia(url: str) -> Dict:
    """
    Scrape Wikipedia article content using BeautifulSoup
    
    Returns:
        dict: Contains title, content, sections, etc.
    """
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract title
        title = soup.find('h1', class_='firstHeading').text.strip()
        
        # Extract main content
        content_div = soup.find('div', class_='mw-parser-output')
        
        # Extract paragraphs (remove citation markers)
        paragraphs = []
        for p in content_div.find_all('p'):
            text = p.get_text().strip()
            if text:
                paragraphs.append(text)
        
        # Extract sections
        sections = []
        for heading in content_div.find_all(['h2', 'h3']):
            section_name = heading.find('span', class_='mw-headline')
            if section_name:
                sections.append(section_name.text.strip())
        
        return {
            'title': title,
            'content': ' '.join(paragraphs[:10]),  # First 10 paragraphs
            'full_text': ' '.join(paragraphs),
            'sections': sections[:15]  # First 15 sections
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to scrape Wikipedia: {str(e)}")


def generate_quiz_with_llm(article_data: Dict) -> QuizResponse:
    """
    Generate quiz using LLM (Gemini or other)
    
    This is where you'll integrate LangChain and your LLM API.
    """
    
    # TODO: Implement LLM integration
    # Example prompt template:
    """
    QUIZ_GENERATION_PROMPT = 
    You are an expert quiz generator. Based on the following Wikipedia article about {title}, 
    generate a comprehensive quiz.
    
    Article Content:
    {content}
    
    Article Sections:
    {sections}
    
    Generate a JSON response with:
    1. A concise summary (2-3 sentences)
    2. Key entities (people, organizations, locations mentioned)
    3. 5-10 quiz questions with:
       - Question text
       - Four options (A-D)
       - Correct answer
       - Difficulty level (easy/medium/hard)
       - Brief explanation citing the relevant section
    4. 5-10 related Wikipedia topics for further reading
    
    Requirements:
    - Questions should be factual and directly answerable from the article
    - Mix difficulty levels (easy, medium, hard)
    - Explanations must reference specific sections
    - Avoid questions that could lead to hallucinations
    - Related topics should be real Wikipedia article titles
    """
    
    # Initialize LLM
    # llm = ChatGoogleGenerativeAI(
    #     model="gemini-pro",
    #     google_api_key=os.getenv("GEMINI_API_KEY"),
    #     temperature=0.3
    # )
    
    # Create prompt and chain
    # prompt = PromptTemplate(...)
    # chain = LLMChain(llm=llm, prompt=prompt)
    # result = chain.run(...)
    
    # Parse LLM response and return QuizResponse
    
    # For now, return mock data
    return QuizResponse(
        id=1,
        url=str(article_data['url']),
        title=article_data['title'],
        summary=article_data['content'][:200] + "...",
        key_entities=KeyEntities(
            people=["Person A", "Person B"],
            organizations=["Org A", "Org B"],
            locations=["Location A", "Location B"]
        ),
        sections=article_data['sections'],
        quiz=[
            QuizQuestion(
                question="Sample question?",
                options=["A", "B", "C", "D"],
                answer="B",
                difficulty="easy",
                explanation="Sample explanation"
            )
        ],
        related_topics=["Topic 1", "Topic 2"]
    )


@app.get("/")
async def root():
    return {
        "message": "DeepKlarity Wiki Quiz Generator API",
        "version": "1.0.0",
        "status": "active"
    }


@app.post("/generate-quiz", response_model=QuizResponse)
async def generate_quiz(request: GenerateQuizRequest):
    """
    Main endpoint to generate quiz from Wikipedia URL
    
    Steps:
    1. Validate URL is a Wikipedia article
    2. Scrape the article content
    3. Send to LLM for quiz generation
    4. Store in database (PostgreSQL/MySQL)
    5. Return quiz data
    """
    url = str(request.url)
    
    # Validate Wikipedia URL
    if 'wikipedia.org/wiki/' not in url:
        raise HTTPException(status_code=400, detail="Invalid Wikipedia URL")
    
    # Check if URL already processed (caching)
    # cached_quiz = check_database_for_url(url)
    # if cached_quiz:
    #     return cached_quiz
    
    # Scrape Wikipedia
    article_data = scrape_wikipedia(url)
    article_data['url'] = url
    
    # Generate quiz with LLM
    quiz_data = generate_quiz_with_llm(article_data)
    
    # Store in database
    # save_to_database(quiz_data)
    
    return quiz_data


@app.get("/quizzes")
async def get_all_quizzes():
    """
    Get all quizzes from database
    """
    # TODO: Implement database query
    # return query_all_quizzes_from_db()
    return []


@app.get("/quiz/{quiz_id}")
async def get_quiz(quiz_id: int):
    """
    Get specific quiz by ID
    """
    # TODO: Implement database query
    # return query_quiz_by_id(quiz_id)
    raise HTTPException(status_code=404, detail="Quiz not found")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
