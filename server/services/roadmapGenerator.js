const { OpenRouter } = require('@openrouter/sdk');

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function generateRoadmap(parsedInput) {
  const { role, company, domain } = parsedInput;

  const systemPrompt = `You are an expert career planning assistant. Generate a structured career roadmap as JSON.

Rules:
- Output ONLY valid JSON, no markdown, no explanation
- Roadmap must have exactly 3 phases: "Beginner", "Intermediate", "Advanced"
- Each phase has exactly 3 steps
- Each step has: title, description, duration, and exactly 2 resources
- Resources must have: title, url, category (one of: "course", "book", "article", "practice", "tool")
- Be specific and practical
- Keep descriptions concise to stay within token limits`;

  const contextParts = [`Role: ${role}`];
  if (company) contextParts.push(`Target company: ${company}`);
  if (domain) contextParts.push(`Domain/specialization: ${domain}`);

  const userPrompt = `Create a career roadmap for: ${contextParts.join('. ')}.`;

  const stream = await openrouter.chat.send({
    model: 'google/gemma-4-31b-it:free',
    system: systemPrompt,
    messages: [
      { role: 'user', content: userPrompt },
    ],
    stream: true,
    max_tokens: 5000,
  });

  let content = "";

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) {
      content += delta;
    }
  }

  // Strip any markdown code fences the model might include
  const cleaned = content.replace(/^```(?:json)?\s*|\s*```$/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (parseErr) {
    console.error('Raw AI response:', content);
    throw new Error('Failed to parse AI response as JSON');
  }
}

module.exports = { generateRoadmap };
