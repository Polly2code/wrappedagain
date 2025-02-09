
export interface SentimentResult {
  label: string;
  score: number;
}

export interface Message {
  sender: string;
  content: string;
  timestamp: string;
  has_emoji: boolean;
}

export interface ChatAnalysisResult {
  total_messages: number;
  messages_sent: number;
  messages_received: number;
  time_distribution: Record<string, number>;
  day_distribution: Record<string, number>;
  top_emojis: Array<{ emoji: string; count: number }>;
  communicator_type: string;
  sentiment_analysis: {
    positive: number;
    negative: number;
  };
}
