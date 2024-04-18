
// Functions:
const extractAttributes = (template: {
  title: string;
  summary: string;
  content: string;
}) => {
  let match: RegExpExecArray | null = null;
  const regex = /\{\{([a-zA-Z0-9_\-]+)\}\}/g;
  const attributes: string[] = [];
  while ((match = regex.exec(template.title)) !== null) attributes.push(match[1]);
  while ((match = regex.exec(template.summary)) !== null) attributes.push(match[1]);
  while ((match = regex.exec(template.content)) !== null) attributes.push(match[1]);

  return [...new Set(attributes)];
};

// Exports:
export default extractAttributes;
