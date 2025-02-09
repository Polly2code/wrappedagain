
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { DropZone } from './chat-analysis/DropZone';
import { AnalysisResults } from './chat-analysis/AnalysisResults';
import { processChat } from '@/lib/chat-analysis';
import { ChatAnalysisResult } from '@/types/chat';
import JSZip from 'jszip';

export const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<ChatAnalysisResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: 'Please select a file first',
        className: "bg-transparent border-red-500",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      let textContent: string;
      
      if (file.name.endsWith('.zip')) {
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(file);
        
        // Find the first .txt file in the zip
        const txtFiles = Object.keys(zipContent.files).filter(filename => 
          filename.endsWith('.txt')
        );
        
        if (txtFiles.length === 0) {
          throw new Error('No txt file found in the zip archive');
        }
        
        const txtFile = zipContent.files[txtFiles[0]];
        textContent = await txtFile.async('string');
        console.log('Extracted text content from zip:', textContent.substring(0, 200) + '...');
      } else {
        // Handle regular txt file
        const reader = new FileReader();
        textContent = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsText(file);
        });
        console.log('File content loaded:', textContent.substring(0, 200) + '...');
      }
      
      console.log('Starting chat processing...');
      const results = await processChat(textContent);
      console.log('Analysis results:', results);
      setAnalysisResults(results);
      setShowResults(true);
      toast({
        title: "Success",
        description: 'Chat analysis completed!',
        className: "bg-transparent border-primary",
      });
    } catch (error) {
      console.error('Error in analysis:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Error analyzing chat file',
        className: "bg-transparent border-red-500",
      });
    } finally {
      setIsProcessing(false);
    }
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
