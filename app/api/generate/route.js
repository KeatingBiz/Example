import OpenAI from 'openai';

export async function POST(req) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response('Missing OpenAI API key', { status: 500 });
    }
    const client = new OpenAI({ apiKey });

    const formData = await req.formData();
    const instructions = formData.get('instructions') || '';
    const count = parseInt(formData.get('count') || '1', 10);

    const prompt = `Create ${count} distinct ad ideas based on these instructions: ${instructions}`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    const text = completion.choices[0]?.message?.content || '';
    const ads = text.split('\n').map((l) => l.trim()).filter(Boolean);
    return Response.json({ ads });
  } catch (err) {
    console.error(err);
    return new Response('Failed to generate ads', { status: 500 });
  }
}
