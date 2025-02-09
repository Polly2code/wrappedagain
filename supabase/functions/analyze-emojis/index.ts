
import { serve } from "https://deno.land/std@0.181.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const messageContent = messages.map(msg => msg.content).join('\n');
    
    console.log('Received request with messages:', messages);
    console.log('OpenAI API Key exists:', !!openAIApiKey);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const requestBody = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an emoji analyzer. Given chat messages, extract and count the most frequently used emojis. Return exactly 5 emojis with their counts in JSON format like [{"emoji": "😊", "count": 5}]. If there are fewer than 5 emojis, include all found emojis. If no emojis are found, return an empty array.'
        },
        {
          role: 'user',
          content: messageContent
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    };

    console.log('Making request to Langdock API with body:', JSON.stringify(requestBody));
    
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
      console.error('Langdock API error response:', errorData);
      console.error('Response status:', response.status);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      throw new Error(`Langdock API error (${response.status}): ${errorData}`);
    }

    const data = await response.json();
    console.log('Langdock API response:', data);

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from Langdock');
    }

    const emojiAnalysis = JSON.parse(data.choices[0].message.content);
    console.log('Parsed emoji analysis:', emojiAnalysis);

    return new Response(JSON.stringify(emojiAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in emoji analysis:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      status: 'error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
