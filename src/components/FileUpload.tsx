import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { pipeline } from '@huggingface/transformers';

export const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processChat = async (fileContent: string) => {
    try {
      console.log('Starting chat analysis...');
      
      // Parse messages
      const lines = fileContent.split('\n');
      const messagePattern = /\[(\d{2}\/\d{2}\/\d{2}, \d{2}:\d{2}:\d{2})\] ([^:]+): (.*)/;
      const messages = lines
        .filter(line => messagePattern.test(line))
        .map(line => {
          const [, timestamp, sender, content] = line.match(messagePattern) || [];
          const date = timestamp.replace(/(\d{2})\/(\d{2})\/(\d{2})/, '20$3-$2-$1');
          return {
            sender,
            content,
            timestamp: new Date(date).toISOString(),
            has_emoji: /[\p{Emoji}]/u.test(content),
          };
        });

      console.log(`Processing ${messages.length} messages...`);

      // Initialize sentiment analysis pipeline
      const classifier = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');

      // Analyze sentiment for a sample of messages
      const sampleSize = Math.min(100, messages.length);
      const sampleMessages = messages
        .sort(() => 0.5 - Math.random())
        .slice(0, sampleSize);

      type SentimentResult = { label: string; score: number; };
      
      const sentiments = await Promise.all(
        sampleMessages.map(async (msg) => {
          const result = await classifier(msg.content);
          // Ensure we're handling both single result and array result cases
          const sentimentResult = Array.isArray(result) ? result[0] : result;
          return sentimentResult as SentimentResult;
        })
      );

      // Calculate analysis
      const analysis = {
        total_messages: messages.length,
        messages_sent: messages.filter(m => m.sender === messages[0].sender).length,
        messages_received: messages.filter(m => m.sender !== messages[0].sender).length,
        time_distribution: calculateTimeDistribution(messages),
        day_distribution: calculateDayDistribution(messages),
        top_emojis: calculateEmojiUsage(messages),
        sentiment_analysis: {
          positive: sentiments.filter(s => s.label === 'POSITIVE').length / sampleSize,
          negative: sentiments.filter(s => s.label === 'NEGATIVE').length / sampleSize,
        },
        communicator_type: determineCommunicatorType(messages),
      };

      console.log('Analysis results:', analysis);
      toast.success('Chat analysis completed!');
      
    } catch (error) {
      console.error('Error processing chat:', error);
      toast.error('Error analyzing chat file');
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile?.name.endsWith('.txt')) {
      setFile(uploadedFile);
      toast.success('Chat file uploaded successfully!');
    } else {
      toast.error('Please upload a valid WhatsApp chat export file (.txt)');
    }
  }, []);

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
        await processChat(text);
      }
    };
    reader.readAsText(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/plain': ['.txt'],
    },
    maxFiles: 1
  });

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out animate-fade-up
          ${isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'
          }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="p-4 rounded-full bg-primary/10">
            {isProcessing ? (
              <div className="animate-spin">
                <Upload className="w-8 h-8 text-primary" />
              </div>
            ) : file ? (
              <FileText className="w-8 h-8 text-primary" />
            ) : (
              <Upload className="w-8 h-8 text-primary" />
            )}
          </div>
          <div>
            {isProcessing ? (
              <p className="font-medium">Analyzing your chat...</p>
            ) : file ? (
              <>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </>
            ) : (
              <>
                <p className="font-medium">Drop your WhatsApp chat export here</p>
                <p className="text-sm text-gray-500 mt-1">
                  or click to select file
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleSubmit}
        disabled={!file || isProcessing}
        className="w-full"
      >
        {isProcessing ? 'Analyzing...' : 'Analyze Chat'}
      </Button>
    </div>
  );
};

// Utility functions for analysis
const calculateTimeDistribution = (messages: any[]) => {
  const distribution: Record<string, number> = {};
  messages.forEach(msg => {
    const hour = new Date(msg.timestamp).getHours();
    distribution[hour] = (distribution[hour] || 0) + 1;
  });
  return distribution;
};

const calculateDayDistribution = (messages: any[]) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const distribution: Record<string, number> = {};
  messages.forEach(msg => {
    const day = days[new Date(msg.timestamp).getDay()];
    distribution[day] = (distribution[day] || 0) + 1;
  });
  return distribution;
};

const calculateEmojiUsage = (messages: any[]) => {
  const emojiRegex = /[\p{Emoji}]/gu;
  const emojiCounts: Record<string, number> = {};
  
  messages.forEach(msg => {
    const emojis = msg.content.match(emojiRegex) || [];
    emojis.forEach(emoji => {
      emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
    });
  });

  return Object.entries(emojiCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([emoji, count]) => ({ emoji, count }));
};

const determineCommunicatorType = (messages: any[]) => {
  const categories = [
    'The Emoji Enthusiast 🎨',
    'The Night Owl 🦉',
    'The Morning Person ☀️',
    'The Conversation Master 🎭',
    'The Brief & Bold ⚡',
    'The Storyteller 📚'
  ];
  
  const userMessages = messages.filter(m => m.sender === messages[0].sender);
  const hasLotsOfEmojis = userMessages.some(m => (m.content.match(/[\p{Emoji}]/gu) || []).length > 3);
  const avgMessageLength = userMessages.reduce((acc, m) => acc + m.content.length, 0) / userMessages.length;
  const nightMessages = userMessages.filter(m => new Date(m.timestamp).getHours() >= 22).length;
  const morningMessages = userMessages.filter(m => new Date(m.timestamp).getHours() <= 6).length;
  
  if (hasLotsOfEmojis) return categories[0];
  if (nightMessages > userMessages.length * 0.3) return categories[1];
  if (morningMessages > userMessages.length * 0.3) return categories[2];
  if (userMessages.length > messages.length * 0.6) return categories[3];
  if (avgMessageLength < 10) return categories[4];
  return categories[5];
};
