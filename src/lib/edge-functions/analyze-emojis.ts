
import { serve } from "https://deno.land/std@0.181.0/http/server.ts";

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
    const { messages } = await req.json();
    const messageContent = messages.map(msg => msg.content).join('\n');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an emoji analyzer. Given chat messages, extract and count the most frequently used emojis. Return exactly 5 emojis with their counts in JSON format like [{"emoji": "😊", "count": 5}].'
          },
          {
            role: 'user',
            content: messageContent
          }
        ],
      }),
    });

    const data = await response.json();
    const emojiAnalysis = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(emojiAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in emoji analysis:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
