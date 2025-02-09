
import { serve } from "https://deno.land/std@0.181.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, analysis_type = 'emoji' } = await req.json();
    const messageContent = messages.map(msg => msg.content).join('\n');
    
    console.log('Received request with messages:', messages);
    console.log('Analysis type:', analysis_type);
    console.log('OpenAI API Key exists:', !!openAIApiKey);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    let systemPrompt;
    if (analysis_type === 'communication_style') {
      const senders = [...new Set(messages.map(msg => msg.sender))];
      const participantsStr = senders.map(s => `"${s}"`).join(',');
      systemPrompt = `Analyze the communication style of each participant in this chat. There may be multiple participants. Return a simple JSON object with communication styles. The response must be in this exact format without any markdown or code blocks: {"communication_styles":{${participantsStr}:"Brief description of style"}}`;
    } else {
      systemPrompt = 'Extract and count emojis from the chat. Return a simple JSON array without any markdown or code blocks, like: [{"emoji":"😊","count":5}]. Return exactly 5 emojis with their counts. If fewer emojis exist, return all found. If no emojis found, return empty array.';
    }

    const requestBody = {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: messageContent
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    };

    console.log('Making request to OpenAI API with body:', JSON.stringify(requestBody));
    
    const response = await fetch('https://api.langdock.com/openai/us/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error response:', errorData);
      console.error('Response status:', response.status);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      throw new Error(`OpenAI API error (${response.status}): ${errorData}`);
    }

    const data = await response.json();
    console.log('OpenAI API response:', data);

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from OpenAI');
    }

    // Clean up the response by removing any markdown code block syntax
    const cleanContent = data.choices[0].message.content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    console.log('Cleaned content:', cleanContent);

    try {
      const analysisResult = JSON.parse(cleanContent);
      console.log('Parsed analysis result:', analysisResult);
      return new Response(JSON.stringify(analysisResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Content that failed to parse:', cleanContent);
      throw new Error(`Failed to parse GPT response as JSON: ${parseError.message}`);
    }
  } catch (error) {
    console.error('Error in analysis:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      status: 'error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
