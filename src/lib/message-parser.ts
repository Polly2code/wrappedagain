
import { Message } from './types/chat';

export const parseMessages = (fileContent: string, maxLines: number = 1000): Message[] => {
  if (!fileContent) {
    throw new Error('No file content provided');
  }

  const lines = fileContent.split('\n').filter(line => line.trim() !== '');
  console.log('Total lines found:', lines.length);
  
  const processedLines = lines.slice(0, maxLines);
  console.log('Processing first', processedLines.length, 'lines');
  
  const messagePattern = /\[?(\d{1,2}[\.\/]\d{1,2}[\.\/]\d{2,4})[,\s]\s*(\d{1,2}:\d{2}(?::\d{2})?)\]?\s*(?:[-\s])*([^:]+?):\s*(.+)/;
  
  const messages: Message[] = [];
  let successfulParses = 0;
  let failedParses = 0;
  
  for (const line of processedLines) {
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

  return messages;
};
