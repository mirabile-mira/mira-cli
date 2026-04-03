const { Anthropic } = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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

  const response = await anthropic.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    stop_sequences: ['</phases>', '</json>'],
  });

  let content = response.content[0].text;

  // Handle stop_reason === 'max_tokens' (truncated response)
  if (response.stop_reason === 'max_tokens') {
    throw new Error('Roadmap response was truncated — increase max_tokens');
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
