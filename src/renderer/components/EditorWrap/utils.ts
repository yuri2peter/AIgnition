import { FileUploader } from 'src/renderer/helpers/FileUploader';
import { TextAreaTextApi } from '../ReactMD';
import { notifications } from '@mantine/notifications';
import TurndownService from 'turndown';
const turndownPluginGfm = require('turndown-plugin-gfm');

export function parseTitleFromMarkdown(markdown: string) {
  const reg = /^(#+\s)(.+)$/;
  const lines = markdown.split('\n');
  for (const line of lines) {
    const execRel = reg.exec(line.trim());
    if (execRel) {
      return execRel[2];
    }
  }
  return '';
}

export function insertFilesIntoEditor(files: File[], api: TextAreaTextApi) {
  files.forEach(async (file) => {
    const uploader = new FileUploader({ file });
    const { url, originalFilename, mimetype } = await uploader.upload();
    api.replaceSelection(
      ` ${
        mimetype.startsWith('image') ? '!' : ''
      }[${originalFilename}](${url}) `
    );
  });
}

export function alertSelectionIsEmpty() {
  const str = 'Please select some text first.';
  notifications.show({
    title: 'Error',
    message: str,
    color: 'red',
  });
}

export function html2markdown(html: string) {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    fence: '```',
  });
  turndownService.use(turndownPluginGfm.gfm);
  const htmlFixed = (() => {
    // if codeblock is copied from vscode.
    const vscodeCodeBlockReg =
      /^<html>\s*<body>\s*<!--StartFragment--><div[^>]+;white-space: pre;">(.*)<\/div><!--EndFragment-->\s*<\/body>\s*<\/html>\s*$/;
    const execRel = vscodeCodeBlockReg.exec(html);
    if (execRel) {
      return `<pre><code>${execRel[1]!.replace(
        /<\/div>/g,
        '</div>\n'
      )}</code></pre>`;
    }

    // normal return
    return html;
  })();
  const markdown = turndownService.turndown(htmlFixed);
  return markdown;
}
