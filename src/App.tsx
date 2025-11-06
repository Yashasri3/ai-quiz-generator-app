import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { GenerateQuiz } from './components/GenerateQuiz';
import { QuizHistory } from './components/QuizHistory';
import { BookOpen, History } from 'lucide-react';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BookOpen className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl">DeepKlarity Technologies</h1>
              <p className="text-sm text-muted-foreground">AI Wiki Quiz Generator</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <BookOpen className="size-4" />
              Generate Quiz
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="size-4" />
              Past Quizzes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <GenerateQuiz />
          </TabsContent>

          <TabsContent value="history">
            <QuizHistory />
          </TabsContent>
        </Tabs>
      </main>

      <Toaster />
    </div>
  );
}
