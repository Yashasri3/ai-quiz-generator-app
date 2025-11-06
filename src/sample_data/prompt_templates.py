"""
LangChain Prompt Templates for Quiz Generation
DeepKlarity Technologies - AI Wiki Quiz Generator

This file contains example prompt templates for generating high-quality quizzes.
These prompts are designed to minimize hallucination and maximize quiz quality.
"""

from langchain.prompts import PromptTemplate, ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List

# ============================================================================
# OUTPUT SCHEMA DEFINITIONS
# ============================================================================

class QuizQuestion(BaseModel):
    """Schema for a single quiz question"""
    question: str = Field(description="The question text")
    options: List[str] = Field(description="Four answer options")
    answer: str = Field(description="The correct answer (must be one of the options)")
    difficulty: str = Field(description="Difficulty level: easy, medium, or hard")
    explanation: str = Field(description="Explanation referencing the article section")

class KeyEntities(BaseModel):
    """Schema for extracted entities"""
    people: List[str] = Field(description="People mentioned in the article")
    organizations: List[str] = Field(description="Organizations mentioned")
    locations: List[str] = Field(description="Locations mentioned")

class QuizOutput(BaseModel):
    """Complete quiz output schema"""
    summary: str = Field(description="2-3 sentence summary of the article")
    key_entities: KeyEntities
    quiz: List[QuizQuestion] = Field(description="5-10 quiz questions")
    related_topics: List[str] = Field(description="5-10 related Wikipedia topics")


# ============================================================================
# PROMPT TEMPLATE 1: COMPREHENSIVE QUIZ GENERATION
# ============================================================================

COMPREHENSIVE_QUIZ_PROMPT = """You are an expert educational content creator specializing in quiz generation.

Your task is to generate a comprehensive quiz based on the following Wikipedia article.

ARTICLE TITLE: {title}

ARTICLE SUMMARY (first paragraphs):
{summary}

ARTICLE SECTIONS:
{sections}

FULL ARTICLE CONTENT:
{content}

IMPORTANT INSTRUCTIONS:
1. Questions MUST be directly answerable from the article content
2. Do NOT include any information not present in the article
3. All four options should be plausible but only one correct
4. Mix difficulty levels: 40% easy, 40% medium, 20% hard
5. Explanations must cite the specific section where the answer is found
6. Avoid yes/no questions
7. Cover different sections of the article
8. Related topics must be real Wikipedia article titles

DIFFICULTY GUIDELINES:
- Easy: Basic facts from introduction, dates, names
- Medium: Information requiring reading specific sections
- Hard: Nuanced information, connections between concepts

OUTPUT FORMAT (JSON):
{{
  "summary": "2-3 sentence overview...",
  "key_entities": {{
    "people": ["Person 1", "Person 2", ...],
    "organizations": ["Org 1", "Org 2", ...],
    "locations": ["Location 1", "Location 2", ...]
  }},
  "quiz": [
    {{
      "question": "What is...?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option B",
      "difficulty": "easy",
      "explanation": "This is mentioned in the 'Early Life' section where it states..."
    }},
    // ... 5-10 questions total
  ],
  "related_topics": ["Topic 1", "Topic 2", ...]
}}

Generate the quiz now:
"""

comprehensive_prompt = PromptTemplate(
    input_variables=["title", "summary", "sections", "content"],
    template=COMPREHENSIVE_QUIZ_PROMPT
)


# ============================================================================
# PROMPT TEMPLATE 2: SECTION-FOCUSED QUIZ GENERATION
# ============================================================================

SECTION_FOCUSED_PROMPT = """You are generating quiz questions for a specific section of a Wikipedia article.

ARTICLE: {title}
SECTION: {section_name}
SECTION CONTENT:
{section_content}

Generate 2 questions specifically about this section.

Requirements:
- Questions must be answerable from the section content only
- Include one easy/medium question and one medium/hard question
- Each question needs 4 distinct options
- Explanation must reference specific information from the section
- No hallucination - only use provided content

Format:
{{
  "questions": [
    {{
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "answer": "B",
      "difficulty": "medium",
      "explanation": "In the {section_name} section, it states that..."
    }}
  ]
}}
"""

section_focused_prompt = PromptTemplate(
    input_variables=["title", "section_name", "section_content"],
    template=SECTION_FOCUSED_PROMPT
)


# ============================================================================
# PROMPT TEMPLATE 3: ENTITY EXTRACTION
# ============================================================================

ENTITY_EXTRACTION_PROMPT = """Extract key entities from this Wikipedia article content.

ARTICLE: {title}
CONTENT: {content}

Extract:
1. PEOPLE: Names of individuals mentioned (max 10 most relevant)
2. ORGANIZATIONS: Companies, institutions, groups mentioned (max 10)
3. LOCATIONS: Cities, countries, places mentioned (max 10)

Only include entities that are:
- Explicitly mentioned in the article
- Relevant to the main topic
- Properly spelled and formatted

Format:
{{
  "people": ["Name 1", "Name 2", ...],
  "organizations": ["Org 1", "Org 2", ...],
  "locations": ["Location 1", "Location 2", ...]
}}
"""

entity_extraction_prompt = PromptTemplate(
    input_variables=["title", "content"],
    template=ENTITY_EXTRACTION_PROMPT
)


# ============================================================================
# PROMPT TEMPLATE 4: RELATED TOPICS GENERATION
# ============================================================================

RELATED_TOPICS_PROMPT = """Based on this Wikipedia article about {title}, suggest 5-10 related topics for further reading.

ARTICLE SUMMARY: {summary}
ARTICLE SECTIONS: {sections}

Requirements:
- Topics must be actual Wikipedia article titles (use proper formatting)
- Topics should expand on concepts mentioned in the article
- Include both broader and related concepts
- Mix different types: people, concepts, events, technologies
- Do not include the current article title

Examples of good suggestions:
- For "Alan Turing" → "Turing Machine", "Enigma Machine", "Computer Science", "Bletchley Park"
- For "Python" → "Guido van Rossum", "Programming Language", "Object-Oriented Programming"

Format:
{{
  "related_topics": ["Topic 1", "Topic 2", ..., "Topic 10"]
}}
"""

related_topics_prompt = PromptTemplate(
    input_variables=["title", "summary", "sections"],
    template=RELATED_TOPICS_PROMPT
)


# ============================================================================
# PROMPT TEMPLATE 5: FEW-SHOT LEARNING WITH EXAMPLES
# ============================================================================

FEW_SHOT_QUIZ_PROMPT = """You are an expert quiz creator. Study these examples of high-quality quiz questions:

EXAMPLE 1 (Easy):
Article: "Alan Turing"
Question: "In which year was Alan Turing born?"
Options: ["1910", "1912", "1914", "1916"]
Answer: "1912"
Explanation: "The 'Early life and education' section states: 'Alan Mathison Turing was born on 23 June 1912.'"

EXAMPLE 2 (Medium):
Article: "Alan Turing"
Question: "What was the name of the device Turing helped develop to break German codes during WWII?"
Options: ["Colossus", "Bombe", "ENIAC", "Mark I"]
Answer: "Bombe"
Explanation: "The 'Cryptanalysis' section describes how 'Turing specified the design of the Bombe, an electromechanical device that could find settings for the Enigma machine.'"

EXAMPLE 3 (Hard):
Article: "Alan Turing"
Question: "Which mathematical problem did Turing address that relates to the halting problem?"
Options: ["The Entscheidungsproblem", "Fermat's Last Theorem", "The Riemann Hypothesis", "P versus NP"]
Answer: "The Entscheidungsproblem"
Explanation: "The 'Career and research' section explains that Turing 'reformulated Kurt Gödel's 1931 results on the limits of proof and computation, replacing Gödel's universal arithmetic-based formal language with the formal and simple hypothetical devices that became known as Turing machines,' which addressed the Entscheidungsproblem."

Now generate similar high-quality questions for:

ARTICLE: {title}
CONTENT: {content}
SECTIONS: {sections}

Generate 5-10 questions following the same quality standards as the examples.
"""

few_shot_prompt = PromptTemplate(
    input_variables=["title", "content", "sections"],
    template=FEW_SHOT_QUIZ_PROMPT
)


# ============================================================================
# PROMPT TEMPLATE 6: CHAIN-OF-THOUGHT QUIZ GENERATION
# ============================================================================

CHAIN_OF_THOUGHT_PROMPT = """Generate a quiz using step-by-step reasoning.

ARTICLE: {title}
CONTENT: {content}

Step 1: Identify the main topics covered in the article.
List 3-5 main topics:

Step 2: For each topic, identify one key fact that would make a good question.
Key facts:

Step 3: For each fact, create a question with 4 plausible options.
Ensure:
- The correct answer is definitely in the article
- Wrong answers are plausible but clearly incorrect
- Options are distinct and don't overlap

Step 4: Assign difficulty based on:
- Easy: Fact is in the first paragraph or repeatedly mentioned
- Medium: Fact requires reading a specific section
- Hard: Fact is mentioned once or requires understanding connections

Step 5: Write explanations that cite the specific section.

Final output in JSON format:
"""

chain_of_thought_prompt = PromptTemplate(
    input_variables=["title", "content"],
    template=CHAIN_OF_THOUGHT_PROMPT
)


# ============================================================================
# PROMPT TEMPLATE 7: VALIDATION AND FACT-CHECKING
# ============================================================================

VALIDATION_PROMPT = """You are a fact-checker reviewing quiz questions.

ARTICLE: {title}
ARTICLE CONTENT: {content}

QUIZ QUESTIONS TO VALIDATE:
{quiz_questions}

For each question, verify:
1. Is the question answerable from the article?
2. Is the correct answer actually stated in the article?
3. Are the wrong options plausible but clearly incorrect?
4. Does the explanation accurately cite the source?

If any question fails validation, provide a corrected version.

Output format:
{{
  "validation_results": [
    {{
      "question_number": 1,
      "valid": true/false,
      "issues": ["issue 1", "issue 2"],
      "corrected_question": {{...}} // only if invalid
    }}
  ]
}}
"""

validation_prompt = PromptTemplate(
    input_variables=["title", "content", "quiz_questions"],
    template=VALIDATION_PROMPT
)


# ============================================================================
# USAGE EXAMPLES
# ============================================================================

def example_usage():
    """
    Example of how to use these prompt templates with LangChain
    """
    from langchain_google_genai import ChatGoogleGenerativeAI
    import os
    
    # Initialize LLM
    llm = ChatGoogleGenerativeAI(
        model="gemini-pro",
        google_api_key=os.getenv("GEMINI_API_KEY"),
        temperature=0.3  # Low temperature for consistency
    )
    
    # Example 1: Comprehensive quiz generation
    article_data = {
        "title": "Alan Turing",
        "summary": "First few paragraphs...",
        "sections": ["Early life", "Career", "WWII", "Legacy"],
        "content": "Full article content..."
    }
    
    # Format the prompt
    formatted_prompt = comprehensive_prompt.format(**article_data)
    
    # Generate quiz
    response = llm.invoke(formatted_prompt)
    
    # Parse JSON response
    import json
    quiz_data = json.loads(response.content)
    
    # Example 2: Section-focused generation
    section_data = {
        "title": "Alan Turing",
        "section_name": "World War II",
        "section_content": "During WWII, Turing worked at Bletchley Park..."
    }
    
    formatted_section_prompt = section_focused_prompt.format(**section_data)
    section_questions = llm.invoke(formatted_section_prompt)
    
    # Example 3: Multi-step generation with validation
    # Step 1: Generate initial quiz
    initial_quiz = llm.invoke(comprehensive_prompt.format(**article_data))
    
    # Step 2: Validate the quiz
    validation_input = {
        "title": article_data["title"],
        "content": article_data["content"],
        "quiz_questions": initial_quiz.content
    }
    validation_result = llm.invoke(validation_prompt.format(**validation_input))
    
    return quiz_data


# ============================================================================
# BEST PRACTICES
# ============================================================================

"""
BEST PRACTICES FOR PROMPT ENGINEERING:

1. GROUNDING:
   - Always provide full article content
   - Explicitly instruct to only use provided content
   - Ask for section citations in explanations

2. STRUCTURE:
   - Use clear, numbered instructions
   - Provide output format examples
   - Break complex tasks into steps

3. QUALITY CONTROL:
   - Set specific difficulty distribution (40/40/20)
   - Require 4 distinct options
   - Demand section references

4. TEMPERATURE:
   - Use 0.3 for consistency
   - Use 0.7 for creative related topics
   - Adjust based on task

5. VALIDATION:
   - Generate quiz first
   - Run validation prompt second
   - Correct any hallucinations

6. FEW-SHOT:
   - Include 2-3 example questions
   - Show desired format clearly
   - Cover all difficulty levels

7. ITERATIVE REFINEMENT:
   - Test with various articles
   - Identify common issues
   - Update prompts accordingly

8. HALLUCINATION PREVENTION:
   - Repeat "only use provided content" multiple times
   - Ask for section citations
   - Use validation step
   - Lower temperature
   - Include examples of grounded responses
"""


# ============================================================================
# ADVANCED: MULTI-STAGE GENERATION PIPELINE
# ============================================================================

def generate_quiz_pipeline(article_data: dict):
    """
    Advanced multi-stage pipeline for high-quality quiz generation
    """
    llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)
    
    # Stage 1: Extract entities
    entities = llm.invoke(entity_extraction_prompt.format(
        title=article_data["title"],
        content=article_data["content"]
    ))
    
    # Stage 2: Generate questions per section
    section_questions = []
    for section_name, section_content in article_data["sections"].items():
        questions = llm.invoke(section_focused_prompt.format(
            title=article_data["title"],
            section_name=section_name,
            section_content=section_content
        ))
        section_questions.extend(json.loads(questions.content)["questions"])
    
    # Stage 3: Generate related topics
    topics = llm.invoke(related_topics_prompt.format(
        title=article_data["title"],
        summary=article_data["summary"],
        sections=list(article_data["sections"].keys())
    ))
    
    # Stage 4: Validate all questions
    validation = llm.invoke(validation_prompt.format(
        title=article_data["title"],
        content=article_data["content"],
        quiz_questions=json.dumps(section_questions)
    ))
    
    # Stage 5: Combine results
    return {
        "entities": json.loads(entities.content),
        "quiz": section_questions,
        "related_topics": json.loads(topics.content)["related_topics"],
        "validation": json.loads(validation.content)
    }
