
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DropZone } from './chat-analysis/DropZone';
import { AnalysisResults } from './chat-analysis/AnalysisResults';
import { processChat } from '@/lib/chat-analysis';
import { ChatAnalysisResult } from '@/types/chat';

export const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<ChatAnalysisResult | null>(null);
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
      console.log('File content loaded:', (text as string)?.substring(0, 200) + '...');
      
      if (typeof text === 'string') {
        try {
          console.log('Starting chat processing...');
          const results = await processChat(text);
          console.log('Analysis results:', results);
          setAnalysisResults(results);
          setShowResults(true);
          toast.success('Chat analysis completed!');
        } catch (error) {
          console.error('Error in analysis:', error);
          toast.error(error instanceof Error ? error.message : 'Error analyzing chat file');
        } finally {
          setIsProcessing(false);
        }
      }
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      toast.error('Error reading file');
      setIsProcessing(false);
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
