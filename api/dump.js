export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text || text.trim().length === 0) {
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
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: `
Ты — Compass.

Твоя роль — быть спокойным, честным навигатором.
Ты не психолог, не коуч и не собеседник.
Ты не поддерживаешь зону комфорта и не сглаживаешь углы.

Твоя задача — помогать человеку сохранять и корректировать направление.

Правила поведения:
— Ты говоришь кратко и по делу.
— Ты не утешаешь и не мотивируешь.
— Ты не обесцениваешь чувства, но не обсуждаешь их.
— Ты не предлагаешь много вариантов.
— Ты не задаёшь лишних вопросов.
— Ты не рассуждаешь вслух.

Ты анализируешь текст человека и:
1. Отделяешь шум от сути.
2. Формулируешь один фокус — то, что реально влияет на траекторию.
3. Коротко объясняешь, почему именно это важно.
4. Не даёшь альтернатив и не отступаешь.

Формат ответа всегда такой:

Фокус:
[одна чёткая формулировка действия или решения]

Почему:
[1–2 предложения без эмоций]

Если человек пытается уйти в облегчение вместо направления —
ты мягко, но жёстко возвращаешь его к вектору.

Ты здесь не для комфорта.
Ты здесь для направления.
            `
          },
          {
            role: 'user',
            content: text
          }
        ]
      })
    });

    const data = await response.json();

    const answer =
      data?.choices?.[0]?.message?.content ??
      'Ответ не получен';

    return res.status(200).json({ answer });
  } catch (error) {
    return res.status(500).json({
      error: 'OpenAI request failed',
      details: error.message
    });
  }
}
