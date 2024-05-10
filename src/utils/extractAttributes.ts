
// Functions:
const extractAttributes = (content: string) => {
  let match: RegExpExecArray | null = null;
  const regex = /\{\{([a-zA-Z0-9_\-]+)\}\}/g;
  const attributes: string[] = [];
  while ((match = regex.exec(content)) !== null) attributes.push(match[1]);

  return [...new Set(attributes)];
};

// Exports:
export default extractAttributes;
