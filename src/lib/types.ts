// Type definitions for the Wiki Quiz Generator

export interface KeyEntities {
  people: string[];
  organizations: string[];
  locations: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

export interface QuizData {
  id: number;
  url: string;
  title: string;
  summary: string;
  key_entities: KeyEntities;
  sections: string[];
  quiz: QuizQuestion[];
  related_topics: string[];
  created_at?: string;
}

export interface UserAnswer {
  questionIndex: number;
  selectedAnswer: string;
}
