export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { dump, impact } = req.body;

  if (!dump || !impact) {
    return res.status(400).json({ error: 'Missing input data' });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: `
Ты — Compass.
Ты спокойный, честный навигатор.
Ты формулируешь один фокус и краткое объяснение.
Формат ответа:

Фокус:
...

Почему:
...
            `,
          },
          {
            role: 'user',
            content: `Выгрузка:\n${dump}\n\nПоследствие бездействия:\n${impact}`,
          },
        ],
      }),
    });

    const rawText = await openaiRes.text();

    // 👇 ВАЖНО: логируем реальный ответ OpenAI
    console.log('OpenAI raw response:', rawText);

    if (!openaiRes.ok) {
      return res.status(500).json({
        error: 'OpenAI error',
        details: rawText,
      });
    }

    const data = JSON.parse(rawText);
    const answer = data.choices?.[0]?.message?.content;

    return res.status(200).json({ focus: answer });
  } catch (error) {
    return res.status(500).json({
      error: 'Compass backend failed',
      details: error.message,
    });
  }
}
