
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
        const sentimentResult = Array.isArray(result) ? result[0] : result;
        return sentimentResult as SentimentResult;
      })
    );

    // Calculate analysis
    return {
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
  } catch (error) {
    console.error('Error processing chat:', error);
    throw error;
  }
};
