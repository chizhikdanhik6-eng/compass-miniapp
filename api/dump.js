export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { text } = req.body;

  console.log('Received text:', text);

  res.status(200).json({
    status: 'ok',
    receivedLength: text ? text.length : 0
  });
}
