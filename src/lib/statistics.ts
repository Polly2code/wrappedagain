
import { Message } from './types/chat';
import { supabase } from '@/integrations/supabase/client';

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

export const calculateEmojiUsage = async (messages: Message[]) => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-emojis', {
      body: { messages },
    });

    if (error) {
      console.error('Error analyzing emojis:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error calling emoji analysis:', error);
    return [];
  }
};

export const determineCommunicatorType = async (messages: Message[]): Promise<Record<string, string>> => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-emojis', {
      body: { messages, analysis_type: 'communication_style' },
    });

    if (error) {
      console.error('Error analyzing communication style:', error);
      return generateDefaultStyles(messages);
    }

    return data.communication_styles;
  } catch (error) {
    console.error('Error calling communication style analysis:', error);
    return generateDefaultStyles(messages);
  }
};

const generateDefaultStyles = (messages: Message[]): Record<string, string> => {
  const uniqueSenders = [...new Set(messages.map(m => m.sender))];
  return Object.fromEntries(
    uniqueSenders.map(sender => [sender, 'The Casual Conversationalist 💬'])
  );
};
