import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { QuizData } from '../lib/types';
import { QuizDisplay } from './QuizDisplay';
import { ScrollArea } from './ui/scroll-area';

interface QuizDetailsModalProps {
  quiz: QuizData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuizDetailsModal({ quiz, open, onOpenChange }: QuizDetailsModalProps) {
  if (!quiz) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Quiz Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <QuizDisplay quizData={quiz} showTakeQuizMode={true} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
