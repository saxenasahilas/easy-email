
// Functions:
const extractMergeTags = (template: {
  title: string;
  summary: string;
  content: string;
}) => {
  let match: RegExpExecArray | null = null;
  const regex = /\{\{([a-zA-Z0-9_\-]+)\}\}/g;
  const mergeTags: string[] = [];
  while ((match = regex.exec(template.title)) !== null) mergeTags.push(match[1]);
  while ((match = regex.exec(template.summary)) !== null) mergeTags.push(match[1]);
  while ((match = regex.exec(template.content)) !== null) mergeTags.push(match[1]);

  return [...new Set(mergeTags)];
};

// Exports:
export default extractMergeTags;
