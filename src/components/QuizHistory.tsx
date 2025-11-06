import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { QuizData } from '../lib/types';
import { getAllQuizzes } from '../lib/api';
import { Loader2, ExternalLink, Eye } from 'lucide-react';
import { QuizDetailsModal } from './QuizDetailsModal';

export function QuizHistory() {
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const data = await getAllQuizzes();
      setQuizzes(data);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (quiz: QuizData) => {
    setSelectedQuiz(quiz);
    setModalOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">No quizzes generated yet.</p>
          <p className="text-sm text-muted-foreground">
            Go to the "Generate Quiz" tab to create your first quiz.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6 border-b">
          <h2>Quiz History</h2>
          <p className="text-sm text-muted-foreground mt-1">
            View all previously generated quizzes
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{quiz.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {quiz.summary}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <a
                      href={quiz.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <span className="max-w-[200px] truncate block">
                        {quiz.url.replace('https://en.wikipedia.org/wiki/', '')}
                      </span>
                      <ExternalLink className="size-3 flex-shrink-0" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {quiz.quiz.length} questions
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(quiz.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(quiz)}
                    >
                      <Eye className="size-4 mr-2" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <QuizDetailsModal
        quiz={selectedQuiz}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
