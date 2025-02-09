
export interface ChatUpload {
  id: string;
  user_id: string;
  file_name: string;
  upload_date: string;
  created_at: string;
}

export interface Message {
  id: string;
  chat_upload_id: string;
  sender: string;
  content: string;
  timestamp: string;
  has_emoji: boolean;
  created_at: string;
}

export interface AnalysisResults {
  id: string;
  chat_upload_id: string;
  total_messages: number;
  messages_sent: number;
  messages_received: number;
  time_distribution: Record<string, number>;
  day_distribution: Record<string, number>;
  top_emojis: Array<{ emoji: string; count: number }>;
  communicator_type: string;
  communication_styles: Record<string, string>;
  created_at: string;
}

export interface ChatAnalysisResult {
  total_messages: number;
  messages_sent: number;
  messages_received: number;
  time_distribution: Record<string, number>;
  day_distribution: Record<string, number>;
  top_emojis: Array<{ emoji: string; count: number }>;
  communication_styles: Record<string, string>;
  sentiment_analysis: {
    positive: number;
    negative: number;
  };
}
