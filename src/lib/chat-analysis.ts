import { pipeline } from '@huggingface/transformers';

export const calculateTimeDistribution = (messages: any[]) => {
  const distribution: Record<string, number> = {};
  messages.forEach(msg => {
    const hour = new Date(msg.timestamp).getHours();
    distribution[hour] = (distribution[hour] || 0) + 1;
  });
  return distribution;
};

export const calculateDayDistribution = (messages: any[]) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const distribution: Record<string, number> = {};
  messages.forEach(msg => {
    const day = days[new Date(msg.timestamp).getDay()];
    distribution[day] = (distribution[day] || 0) + 1;
  });
  return distribution;
};

export const calculateEmojiUsage = (messages: any[]) => {
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

export const determineCommunicatorType = (messages: any[]) => {
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

export const processChat = async (fileContent: string) => {
  try {
    console.log('Starting chat analysis...');
    
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    console.log('Total lines to process:', lines.length);
    
    const messagePattern = /^\[?(\d{1,2}[\.\/]\d{1,2}[\.\/]\d{2,4})[,\s]\s*(\d{1,2}:\d{2}(?::\d{2})?)\]?\s*(?:[-\s:])*\s*([^:]+?):\s*(.+)$/;
    
    console.log('Parsing messages...');
    const messages = [];
    
    for (let i = 0; i < lines.length; i++) {
      if (i % 1000 === 0) {
        console.log(`Processing messages: ${i}/${lines.length}`);
      }

      const line = lines[i];
      const match = line.match(messagePattern);
      
      if (!match) continue;
      
      const [, datePart, timePart, sender, content] = match;
      
      try {
        const dateComponents = datePart.split(/[\.\/]/);
        const day = parseInt(dateComponents[0]);
        const month = parseInt(dateComponents[1]) - 1;
        let year = parseInt(dateComponents[2]);
        if (year < 100) year += 2000;
        
        const timeComponents = timePart.split(':');
        const hours = parseInt(timeComponents[0]);
        const minutes = parseInt(timeComponents[1]);
        const seconds = timeComponents[2] ? parseInt(timeComponents[2]) : 0;
        
        const date = new Date(year, month, day, hours, minutes, seconds);
        
        if (!isNaN(date.getTime())) {
          messages.push({
            sender: sender.trim(),
            content: content.trim(),
            timestamp: date.toISOString(),
            has_emoji: /[\p{Emoji}]/u.test(content)
          });
        }
      } catch (error) {
        continue;
      }
    }

    console.log(`Successfully parsed ${messages.length} messages`);
    
    if (messages.length === 0) {
      throw new Error('No messages could be parsed from the file');
    }

    const sampleSize = Math.min(20, messages.length);
    console.log(`Performing sentiment analysis on ${sampleSize} messages...`);

    const classifier = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
    
    const sampleMessages = messages
      .sort(() => 0.5 - Math.random())
      .slice(0, sampleSize);

    type SentimentResult = { label: string; score: number; };
    
    const sentiments = await Promise.all(
      sampleMessages.map(async (msg) => {
        try {
          const result = await classifier(msg.content);
          const sentimentResult = Array.isArray(result) ? result[0] : result;
          return sentimentResult as SentimentResult;
        } catch (error) {
          return { label: 'NEUTRAL', score: 0.5 };
        }
      })
    );

    console.log('Calculating final results...');
    const results = {
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

    console.log('Analysis complete!');
    return results;

  } catch (error) {
    console.error('Error processing chat:', error);
    throw error;
  }
};
