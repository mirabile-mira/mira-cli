const { OpenRouter } = require('@openrouter/sdk');

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  httpReferer: 'mirabile.app',
  appTitle: 'Mirabile',
});

async function generateRoadmap(parsedInput) {
  console.log('Generating roadmap for parsed input:', parsedInput);
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

  console.log('Sending request to OpenRouter...');
  console.log('Request payload:', {
    model: 'google/gemma-4-31b-it:free',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    stream: false,
    max_tokens: 5000,
  });

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'mirabile.app',
        'X-Title': 'Mirabile',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        stream: false,
        max_tokens: 5000,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API response:', data);

    if (data.choices && data.choices[0] && data.choices[0].message) {
      let content = data.choices[0].message.content;
      console.log('Content received:', content.substring(0, 100) + '...');
      return JSON.parse(content.replace(/^```(?:json)?\s*|\s*```$/g, '').trim());
    } else {
      throw new Error('Invalid response structure from OpenRouter');
    }
  } catch (error) {
    console.error('Direct API call error:', error);
    throw error;
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
