
import { Message, ChatAnalysisResult } from './types/chat';
import { parseMessages } from './message-parser';
import { 
  calculateTimeDistribution, 
  calculateDayDistribution, 
  calculateEmojiUsage,
  determineCommunicatorType 
} from './statistics';

export const processChat = async (fileContent: string): Promise<ChatAnalysisResult> => {
  try {
    console.log('Starting chat analysis with content:', fileContent.substring(0, 200) + '...');
    
    const messages = parseMessages(fileContent);
    console.log(`Successfully parsed ${messages.length} messages`);
    
    const [topEmojis, styles] = await Promise.all([
      calculateEmojiUsage(messages),
      determineCommunicatorType(messages)
    ]);

    const basicResults: ChatAnalysisResult = {
      total_messages: messages.length,
      messages_sent: messages.filter(m => m.sender === messages[0].sender).length,
      messages_received: messages.filter(m => m.sender !== messages[0].sender).length,
      time_distribution: calculateTimeDistribution(messages),
      day_distribution: calculateDayDistribution(messages),
      top_emojis: topEmojis,
      communication_styles: styles,
      sentiment_analysis: {
        positive: 0.5,
        negative: 0.5,
      }
    };

    console.log('Analysis complete! Results:', basicResults);
    return basicResults;

  } catch (error) {
    console.error('Error in chat analysis:', error);
    throw error;
  }
};

export {
  calculateTimeDistribution,
  calculateDayDistribution,
  calculateEmojiUsage,
  determineCommunicatorType
};

