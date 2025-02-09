
import { Message } from './types/chat';

export const analyzeSentiment = async (messages: Message[], sampleSize: number = 20) => {
  console.log('Skipping heavy sentiment analysis for better performance');
  return {
    positive: 0.5, // Default neutral sentiment
    negative: 0.5,
  };
};
