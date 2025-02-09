
import { pipeline } from '@huggingface/transformers';
import { SentimentResult } from './types/chat';

let classifier: any = null;

export const initializeClassifier = async () => {
  if (!classifier) {
    console.log('Initializing sentiment analysis pipeline...');
    try {
      classifier = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english', {
        progress_callback: (progress: any) => {
          console.log('Loading model:', Math.round(progress.progress * 100), '%');
        }
      });
    } catch (error) {
      console.error('Error initializing classifier:', error);
      throw new Error('Failed to initialize sentiment analysis model');
    }
  }
  return classifier;
};

export const analyzeSentiment = async (messages: { content: string }[], sampleSize: number = 20) => {
  const sampleMessages = messages
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.min(sampleSize, messages.length));

  console.log(`Performing sentiment analysis on ${sampleMessages.length} messages...`);

  try {
    const clf = await initializeClassifier();
    
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

    return {
      positive: sentiments.filter(s => s.label === 'POSITIVE').length / sampleMessages.length,
      negative: sentiments.filter(s => s.label === 'NEGATIVE').length / sampleMessages.length,
    };
  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    return {
      positive: 0,
      negative: 0,
    };
  }
};
