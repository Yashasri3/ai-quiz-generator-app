import { QuizData } from './types';
import { createClient } from '../utils/supabase/client';

const KV_PREFIX = 'wiki_quiz_';

// Generate a unique ID for each quiz
function generateQuizId(): number {
  return Date.now();
}

// Save quiz data to Supabase KV store
export async function saveQuiz(quizData: Omit<QuizData, 'id' | 'created_at'>): Promise<QuizData> {
  const supabase = createClient();
  const id = generateQuizId();
  const created_at = new Date().toISOString();
  
  const fullQuizData: QuizData = {
    ...quizData,
    id,
    created_at,
  };

  // Store the quiz data
  const { error } = await supabase
    .from('kv_store_70da4a0c')
    .insert({
      key: `${KV_PREFIX}${id}`,
      value: fullQuizData,
    });

  if (error) {
    console.error('Error saving quiz:', error);
    throw new Error('Failed to save quiz');
  }

  return fullQuizData;
}

// Get all quizzes from Supabase KV store
export async function getAllQuizzes(): Promise<QuizData[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('kv_store_70da4a0c')
    .select('value')
    .like('key', `${KV_PREFIX}%`)
    .order('key', { ascending: false });

  if (error) {
    // If the table doesn't exist yet (404) or any other read error, treat as empty cache
    console.error('Error fetching quizzes (treating as empty cache):', error);
    return [];
  }

  return data?.map((item: any) => item.value as QuizData) || [];
}

// Get a single quiz by ID
export async function getQuizById(id: number): Promise<QuizData | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('kv_store_70da4a0c')
    .select('value')
    .eq('key', `${KV_PREFIX}${id}`)
    .single();

  if (error) {
    console.error('Error fetching quiz:', error);
    return null;
  }

  return data?.value as QuizData;
}

// Check if URL already exists in database (for caching)
export async function checkUrlExists(url: string): Promise<QuizData | null> {
  const allQuizzes = await getAllQuizzes();
  return allQuizzes.find(quiz => quiz.url === url) || null;
}

// API call to Python backend (to be implemented by the user)
export async function generateQuizFromUrl(url: string): Promise<QuizData> {
  // This is a placeholder that will connect to the Python backend
  // The user needs to implement the Python backend (FastAPI/Django)
  // and update this URL to point to their deployed backend
  
  const PYTHON_BACKEND_URL = 'YOUR_PYTHON_BACKEND_URL_HERE'; // Update this!
  
  try {
    const response = await fetch(`${PYTHON_BACKEND_URL}/generate-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling Python backend:', error);
    
    // For demonstration purposes, return mock data
    // Remove this when connecting to real Python backend
    return generateMockQuizData(url);
  }
}

// Mock data generator for testing (remove when Python backend is ready)
function generateMockQuizData(url: string): QuizData {
  const urlParts = url.split('/');
  const topic = urlParts[urlParts.length - 1].replace(/_/g, ' ');
  
  return {
    id: Date.now(),
    url,
    title: topic,
    summary: `This is a comprehensive article about ${topic}. The article covers various aspects including historical context, key contributions, and lasting impact on the field.`,
    key_entities: {
      people: ['Person A', 'Person B'],
      organizations: ['Organization A', 'Organization B'],
      locations: ['Location A', 'Location B'],
    },
    sections: ['Introduction', 'Early Life', 'Career', 'Legacy', 'References'],
    quiz: [
      {
        question: `What is a key fact about ${topic}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        answer: 'Option B',
        difficulty: 'easy',
        explanation: 'This information is mentioned in the introduction section.',
      },
      {
        question: `Which organization is associated with ${topic}?`,
        options: ['Org A', 'Org B', 'Org C', 'Org D'],
        answer: 'Org B',
        difficulty: 'medium',
        explanation: 'Detailed in the career section.',
      },
      {
        question: `What was the major contribution of ${topic}?`,
        options: ['Contribution A', 'Contribution B', 'Contribution C', 'Contribution D'],
        answer: 'Contribution C',
        difficulty: 'hard',
        explanation: 'Explained in the legacy section.',
      },
    ],
    related_topics: ['Related Topic 1', 'Related Topic 2', 'Related Topic 3'],
  };
}
