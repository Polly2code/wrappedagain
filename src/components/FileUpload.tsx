
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DropZone } from './chat-analysis/DropZone';
import { AnalysisResults } from './chat-analysis/AnalysisResults';
import { processChat } from '@/lib/chat-analysis';

type AnalysisResults = {
  total_messages: number;
  messages_sent: number;
  messages_received: number;
  time_distribution: Record<string, number>;
  day_distribution: Record<string, number>;
  top_emojis: Array<{ emoji: string; count: number }>;
  sentiment_analysis: {
    positive: number;
    negative: number;
  };
  communicator_type: string;
};

export const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        try {
          const results = await processChat(text);
          setAnalysisResults(results);
          setShowResults(true);
          toast.success('Chat analysis completed!');
        } catch (error) {
          toast.error('Error analyzing chat file');
        } finally {
          setIsProcessing(false);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <DropZone 
        file={file}
        isProcessing={isProcessing}
        setFile={setFile}
      />
      
      <Button 
        onClick={handleSubmit}
        disabled={!file || isProcessing}
        className="w-full"
      >
        {isProcessing ? 'Analyzing...' : 'Analyze Chat'}
      </Button>

      <AnalysisResults
        showResults={showResults}
        setShowResults={setShowResults}
        analysisResults={analysisResults}
      />
    </div>
  );
};
