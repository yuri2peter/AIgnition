export function parseTitleFromMarkdown(markdown: string) {
  const reg = /^(#+\s)?(.+)$/;
  const lines = markdown.split('\n');
  for (const line of lines) {
    const execRel = reg.exec(line.trim());
    if (execRel) {
      return execRel[2];
    }
  }
  return '';
}
