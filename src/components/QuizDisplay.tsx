import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { QuizData, UserAnswer } from '../lib/types';
import { CheckCircle2, XCircle, ExternalLink, Award } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface QuizDisplayProps {
  quizData: QuizData;
  showTakeQuizMode?: boolean;
}

export function QuizDisplay({ quizData, showTakeQuizMode = false }: QuizDisplayProps) {
  const [quizMode, setQuizMode] = useState<'view' | 'take'>('view');
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    if (submitted) return;

    const newAnswers = [...userAnswers];
    const existingIndex = newAnswers.findIndex(a => a.questionIndex === questionIndex);
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = { questionIndex, selectedAnswer: answer };
    } else {
      newAnswers.push({ questionIndex, selectedAnswer: answer });
    }
    
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setUserAnswers([]);
    setSubmitted(false);
  };

  const calculateScore = () => {
    let correct = 0;
    quizData.quiz.forEach((question, index) => {
      const userAnswer = userAnswers.find(a => a.questionIndex === index);
      if (userAnswer?.selectedAnswer === question.answer) {
        correct++;
      }
    });
    return { correct, total: quizData.quiz.length };
  };

  const getAnswerForQuestion = (questionIndex: number) => {
    return userAnswers.find(a => a.questionIndex === questionIndex)?.selectedAnswer;
  };

  const isCorrectAnswer = (questionIndex: number, option: string) => {
    const userAnswer = getAnswerForQuestion(questionIndex);
    const correctAnswer = quizData.quiz[questionIndex].answer;
    
    if (!submitted) return false;
    
    if (option === correctAnswer) return true;
    if (option === userAnswer && option !== correctAnswer) return false;
    return null;
  };

  const score = submitted ? calculateScore() : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <h1>{quizData.title}</h1>
              <a 
                href={quizData.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                View Wikipedia Article <ExternalLink className="size-3" />
              </a>
            </div>
            
            {showTakeQuizMode && (
              <div className="flex gap-2">
                <Button
                  variant={quizMode === 'view' ? 'default' : 'outline'}
                  onClick={() => {
                    setQuizMode('view');
                    setSubmitted(false);
                    setUserAnswers([]);
                  }}
                >
                  View Mode
                </Button>
                <Button
                  variant={quizMode === 'take' ? 'default' : 'outline'}
                  onClick={() => {
                    setQuizMode('take');
                    setSubmitted(false);
                    setUserAnswers([]);
                  }}
                >
                  Take Quiz
                </Button>
              </div>
            )}
          </div>

          <p className="text-muted-foreground">{quizData.summary}</p>
        </div>
      </Card>

      {/* Key Entities */}
      <Card className="p-6">
        <h3 className="mb-4">Key Entities</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-2">People</p>
            <div className="flex flex-wrap gap-2">
              {quizData.key_entities.people.map((person, index) => (
                <Badge key={index} variant="secondary">{person}</Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Organizations</p>
            <div className="flex flex-wrap gap-2">
              {quizData.key_entities.organizations.map((org, index) => (
                <Badge key={index} variant="secondary">{org}</Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Locations</p>
            <div className="flex flex-wrap gap-2">
              {quizData.key_entities.locations.map((location, index) => (
                <Badge key={index} variant="secondary">{location}</Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Sections */}
      <Card className="p-6">
        <h3 className="mb-4">Article Sections</h3>
        <div className="flex flex-wrap gap-2">
          {quizData.sections.map((section, index) => (
            <Badge key={index} variant="outline">{section}</Badge>
          ))}
        </div>
      </Card>

      {/* Quiz Score (if submitted) */}
      {quizMode === 'take' && submitted && score && (
        <Alert className="bg-green-50 border-green-200">
          <Award className="size-4 text-green-600" />
          <AlertDescription className="text-green-900">
            <span className="font-semibold">Quiz Complete!</span> You scored {score.correct} out of {score.total} ({Math.round((score.correct / score.total) * 100)}%)
          </AlertDescription>
        </Alert>
      )}

      {/* Quiz Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3>Quiz Questions</h3>
          {quizMode === 'take' && !submitted && userAnswers.length === quizData.quiz.length && (
            <Button onClick={handleSubmit}>Submit Quiz</Button>
          )}
          {quizMode === 'take' && submitted && (
            <Button onClick={handleReset} variant="outline">Try Again</Button>
          )}
        </div>

        {quizData.quiz.map((question, index) => {
          const userAnswer = getAnswerForQuestion(index);
          const isQuizMode = quizMode === 'take';
          
          return (
            <Card key={index} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-muted-foreground">Question {index + 1}</span>
                      <Badge 
                        variant={
                          question.difficulty === 'easy' ? 'secondary' : 
                          question.difficulty === 'medium' ? 'default' : 
                          'destructive'
                        }
                      >
                        {question.difficulty}
                      </Badge>
                    </div>
                    <p className="font-medium">{question.question}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = userAnswer === option;
                    const answerStatus = isCorrectAnswer(index, option);
                    
                    return (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswerSelect(index, option)}
                        disabled={!isQuizMode || submitted}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          isQuizMode && !submitted
                            ? isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            : submitted && answerStatus === true
                            ? 'border-green-500 bg-green-50'
                            : submitted && answerStatus === false
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200'
                        } ${!isQuizMode || submitted ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {submitted && answerStatus === true && (
                            <CheckCircle2 className="size-5 text-green-600" />
                          )}
                          {submitted && answerStatus === false && (
                            <XCircle className="size-5 text-red-600" />
                          )}
                          {!isQuizMode && option === question.answer && (
                            <Badge variant="secondary">Correct Answer</Badge>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {(quizMode === 'view' || submitted) && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Explanation:</p>
                      <p className="text-sm">{question.explanation}</p>
                    </div>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Related Topics */}
      <Card className="p-6">
        <h3 className="mb-4">Related Topics for Further Reading</h3>
        <div className="flex flex-wrap gap-2">
          {quizData.related_topics.map((topic, index) => (
            <Badge key={index} variant="outline" className="cursor-pointer hover:bg-gray-100">
              {topic}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}
