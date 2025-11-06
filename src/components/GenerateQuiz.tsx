import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { QuizData } from '../lib/types';
import { generateQuizFromUrl, saveQuiz, checkUrlExists } from '../lib/api';
import { QuizDisplay } from './QuizDisplay';
import { Alert, AlertDescription } from './ui/alert';

export function GenerateQuiz() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isCached, setIsCached] = useState(false);

  const validateWikipediaUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('wikipedia.org');
    } catch {
      return false;
    }
  };

  const handleGenerate = async () => {
    setError(null);
    setIsCached(false);
    
    const rawInput = url.trim();
    if (!rawInput) {
      setError('Please enter a Wikipedia URL');
      return;
    }

    // Normalize protocol if missing
    const normalizedUrl = /^https?:\/\//i.test(rawInput) ? rawInput : `https://${rawInput}`;

    if (!validateWikipediaUrl(normalizedUrl)) {
      setError('Please enter a valid Wikipedia URL (e.g., https://en.wikipedia.org/wiki/...)');
      return;
    }

    setLoading(true);

    try {
      // Check if URL already exists in database (caching)
      const existingQuiz = await checkUrlExists(normalizedUrl);
      
      if (existingQuiz) {
        setQuizData(existingQuiz);
        setIsCached(true);
        setLoading(false);
        return;
      }

      // Generate new quiz from Python backend
      const generatedQuiz = await generateQuizFromUrl(normalizedUrl);
      
      // Save to database (graceful fallback if save fails)
      try {
        const savedQuiz = await saveQuiz(generatedQuiz);
        setQuizData(savedQuiz);
      } catch (saveErr) {
        console.error('Error saving quiz, showing unsaved quiz instead:', saveErr);
        setQuizData(generatedQuiz);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the quiz');
      console.error('Error generating quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleGenerate();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="mb-2">Generate Quiz from Wikipedia Article</h2>
            <p className="text-muted-foreground">
              Enter a Wikipedia article URL to automatically generate a quiz based on the content
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wiki-url">Wikipedia URL</Label>
            <div className="flex gap-2">
              <Input
                id="wiki-url"
                type="url"
                placeholder="https://en.wikipedia.org/wiki/Alan_Turing"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <Button onClick={handleGenerate} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Quiz'
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isCached && (
            <Alert>
              <AlertDescription>
                This quiz was loaded from cache. The URL has been processed before.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Card>

      {quizData && <QuizDisplay quizData={quizData} showTakeQuizMode={true} />}
    </div>
  );
}
