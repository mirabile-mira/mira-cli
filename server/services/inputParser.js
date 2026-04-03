function parseInput(goal) {
  const trimmed = goal.trim();
  if (!trimmed) throw new Error('Goal cannot be empty');

  const atMatch = trimmed.match(/^(.+?)\s+at\s+(.+)$/i);
  if (atMatch) {
    return {
      role: atMatch[1].trim(),
      company: atMatch[2].trim(),
      domain: null,
    };
  }

  const domainMatch = trimmed.match(/^(.+?)\s+(?:focusing on|specializing in|in)\s+(.+)$/i);
  if (domainMatch) {
    return {
      role: domainMatch[1].trim(),
      company: null,
      domain: domainMatch[2].trim(),
    };
  }

  return { role: trimmed, company: null, domain: null };
}

module.exports = { parseInput };
