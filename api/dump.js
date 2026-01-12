export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Ты — Compass. Спокойный, честный навигатор. ' +
              'Не утешай. Не мотивируй. ' +
              'Дай краткий и ясный вектор направления.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.2
      })
    });

    const data = await response.json();

    const answer =
      data?.choices?.[0]?.message?.content ?? 'Ответ не получен';

    return res.status(200).json({ answer });
  } catch (error) {
    return res.status(500).json({
      error: 'OpenAI request failed',
      details: error.message
    });
  }
}
