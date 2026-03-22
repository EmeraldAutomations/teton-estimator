export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { history } = req.body;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://teton-estimator.vercel.app',
      'X-Title': 'Teton Repair & Remodel Estimator'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3-5-haiku',
      max_tokens: 1024,
      messages: [
        {
          role: 'system',
          content: process.env.SYSTEM_PROMPT
        },
        ...history
      ]
    })
  });

  const data = await response.json();
  console.log('OpenRouter response:', JSON.stringify(data));

  if (data.error) {
    console.error('OpenRouter error:', data.error.message);
    return res.json({ reply: `Error: ${data.error.message}` });
  }

  const reply = data.choices?.[0]?.message?.content
    || "I'm having trouble right now — please call us at (907) 252-3128.";

  res.json({ reply });
}
