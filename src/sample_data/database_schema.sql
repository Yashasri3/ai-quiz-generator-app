-- Database Schema for DeepKlarity Wiki Quiz Generator
-- Compatible with PostgreSQL and MySQL

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
    id SERIAL PRIMARY KEY,
    url VARCHAR(500) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz content table (stores JSON data)
CREATE TABLE IF NOT EXISTS quiz_content (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    key_entities JSONB,  -- Use JSON for MySQL
    sections JSONB,
    related_topics JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,  -- Array of 4 options
    correct_answer VARCHAR(255) NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
    explanation TEXT,
    question_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX idx_quizzes_url ON quizzes(url);
CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX idx_quiz_content_quiz_id ON quiz_content(quiz_id);

-- Optional: User table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: User quiz attempts (for scoring)
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    score INTEGER,
    total_questions INTEGER,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Raw HTML cache (bonus feature)
CREATE TABLE IF NOT EXISTS article_cache (
    id SERIAL PRIMARY KEY,
    url VARCHAR(500) UNIQUE NOT NULL,
    html_content TEXT,
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample query to get full quiz data
-- SELECT 
--     q.id,
--     q.url,
--     q.title,
--     q.summary,
--     qc.key_entities,
--     qc.sections,
--     qc.related_topics,
--     json_agg(
--         json_build_object(
--             'question', qu.question_text,
--             'options', qu.options,
--             'answer', qu.correct_answer,
--             'difficulty', qu.difficulty,
--             'explanation', qu.explanation
--         ) ORDER BY qu.question_order
--     ) as quiz
-- FROM quizzes q
-- LEFT JOIN quiz_content qc ON q.id = qc.quiz_id
-- LEFT JOIN questions qu ON q.id = qu.quiz_id
-- WHERE q.id = 1
-- GROUP BY q.id, qc.key_entities, qc.sections, qc.related_topics;
