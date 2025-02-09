import { pipeline } from '@huggingface/transformers';

// Type definitions for sentiment analysis
interface SentimentResult {
  label: string;
  score: number;
}

interface Message {
  sender: string;
  content: string;
  timestamp: string;
  has_emoji: boolean;
}

export const calculateTimeDistribution = (messages: Message[]) => {
  const distribution: Record<string, number> = {};
  messages.forEach(msg => {
    const hour = new Date(msg.timestamp).getHours();
    distribution[hour] = (distribution[hour] || 0) + 1;
  });
  return distribution;
};

export const calculateDayDistribution = (messages: Message[]) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const distribution: Record<string, number> = {};
  messages.forEach(msg => {
    const day = days[new Date(msg.timestamp).getDay()];
    distribution[day] = (distribution[day] || 0) + 1;
  });
  return distribution;
};

export const calculateEmojiUsage = (messages: Message[]) => {
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

export const determineCommunicatorType = (messages: Message[]) => {
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

let classifier: any = null;

const initializeClassifier = async () => {
  if (!classifier) {
    console.log('Initializing sentiment analysis pipeline...');
    classifier = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english', {
      quantized: true,
      progress_callback: (progress: any) => {
        console.log('Loading model:', Math.round(progress.progress * 100), '%');
      }
    });
  }
  return classifier;
};

export const processChat = async (fileContent: string) => {
  try {
    console.log('Starting chat analysis with content length:', fileContent.length);
    
    if (!fileContent) {
      throw new Error('No file content provided');
    }
    
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    console.log('Total lines to process:', lines.length);
    
    const messagePattern = /\[?(\d{1,2}[\.\/]\d{1,2}[\.\/]\d{2,4})[,\s]\s*(\d{1,2}:\d{2}(?::\d{2})?)\]?\s*(?:[-\s])*([^:]+?):\s*(.+)/;
    
    console.log('Starting message parsing...');
    const messages: Message[] = [];
    let successfulParses = 0;
    let failedParses = 0;
    
    for (const line of lines) {
      const match = line.match(messagePattern);
      
      if (!match) {
        failedParses++;
        continue;
      }
      
      const [, datePart, timePart, sender, content] = match;
      
      try {
        const [day, month, yearStr] = datePart.split(/[\.\/]/);
        const year = yearStr.length === 2 ? '20' + yearStr : yearStr;
        
        const [hours, minutes, seconds = '00'] = timePart.split(':');
        
        const timestamp = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hours),
          parseInt(minutes),
          parseInt(seconds)
        );
        
        if (!isNaN(timestamp.getTime())) {
          messages.push({
            sender: sender.trim(),
            content: content.trim(),
            timestamp: timestamp.toISOString(),
            has_emoji: /[\p{Emoji}]/u.test(content)
          });
          successfulParses++;
        } else {
          failedParses++;
        }
      } catch (error) {
        failedParses++;
      }
    }

    console.log(`Parsing complete - Successful: ${successfulParses}, Failed: ${failedParses}`);
    
    if (messages.length === 0) {
      throw new Error('No messages could be parsed from the file. Please check the file format.');
    }

    const basicResults = {
      total_messages: messages.length,
      messages_sent: messages.filter(m => m.sender === messages[0].sender).length,
      messages_received: messages.filter(m => m.sender !== messages[0].sender).length,
      time_distribution: calculateTimeDistribution(messages),
      day_distribution: calculateDayDistribution(messages),
      top_emojis: calculateEmojiUsage(messages),
      communicator_type: determineCommunicatorType(messages),
      sentiment_analysis: {
        positive: 0,
        negative: 0,
      }
    };

    const sampleSize = Math.min(20, messages.length);
    console.log(`Performing sentiment analysis on ${sampleSize} messages...`);

    try {
      const clf = await initializeClassifier();
      
      const sampleMessages = messages
        .sort(() => 0.5 - Math.random())
        .slice(0, sampleSize);

      console.log('Running sentiment analysis...');
      const sentiments = await Promise.all(
        sampleMessages.map(async (msg) => {
          try {
            const result = await clf(msg.content);
            return result[0] as SentimentResult;
          } catch (error) {
            console.error('Error in sentiment analysis:', error);
            return { label: 'NEUTRAL', score: 0.5 };
          }
        })
      );

      basicResults.sentiment_analysis = {
        positive: sentiments.filter(s => s.label === 'POSITIVE').length / sampleSize,
        negative: sentiments.filter(s => s.label === 'NEGATIVE').length / sampleSize,
      };
    } catch (error) {
      console.error('Error in sentiment analysis:', error);
      // Continue with basic results if sentiment analysis fails
    }

    console.log('Analysis complete! Results:', basicResults);
    return basicResults;

  } catch (error) {
    console.error('Error in chat analysis:', error);
    throw new Error(`Chat analysis failed: ${error.message}`);
  }
};
