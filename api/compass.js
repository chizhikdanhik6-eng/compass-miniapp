export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { dump, impact } = req.body;

  if (!dump || !impact) {
    return res.status(400).json({ error: 'Missing input data' });
  }

  const prompt = `
Текст 1 — выгрузка мыслей:
${dump}

Текст 2 — что аукнется сильнее всего, если ничего не сделать:
${impact}

Сформулируй фокус недели строго по правилам Compass.
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: `
Ты — Compass.

Твоя роль — быть спокойным, честным навигатором.
Ты не психолог, не коуч и не собеседник.

Ты не утешаешь, не мотивируешь и не предлагаешь варианты.
Ты фиксируешь направление.

Формат ответа всегда такой:

Фокус:
[одна чёткая формулировка]

Почему:
[1–2 предложения]
            `
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content;

    return res.status(200).json({ focus: answer });
  } catch (error) {
    return res.status(500).json({
      error: 'Compass processing failed',
      details: error.message
    });
  }
}
