import { encode, decode } from 'js-base64';
import { TextAreaTextApi } from '..';

export function writeCopyline(text: string) {
  navigator.clipboard.write(
    getHtmlClipboardItem(`<p data-is-copyline="true">${encode(text)}</p>`)
  );
}

function getHtmlClipboardItem(text: string) {
  const type = 'text/html';
  const blob = new Blob([text], { type });
  const data = [new ClipboardItem({ [type]: blob })];
  return data;
}

export function tryPasteCopyline(
  e: React.ClipboardEvent<Element>,
  textApi: TextAreaTextApi
) {
  const textarea = e.target as HTMLTextAreaElement;
  const { value, selectionStart, selectionEnd } = textarea;
  const html = e.clipboardData.getData('text/html');
  if (html) {
    const line = parseCopyLine(html);
    if (line && selectionStart === selectionEnd) {
      let p1 = 0;
      for (p1 = selectionStart; p1 > 0; p1--) {
        if (value[p1 - 1] === '\n') {
          break;
        }
      }
      if (p1 < 0) {
        p1 = 0;
      }
      textApi.setSelectionRange({
        start: p1,
        end: p1,
      });
      textApi.replaceSelection(`${line}\n`);
      e.preventDefault();
      return true;
    }
  }
  return false;
}

/*
<html>
<body>
<!--StartFragment--><html><head></head><body><p data-is-copyline="true">notionnotion</p></body></html><!--EndFragment-->
</body>
</html>
*/
function parseCopyLine(htmlStr: string) {
  const copylineBlockReg = /<p data-is-copyline="true">(.*)<\/p>/;
  const execRel = copylineBlockReg.exec(htmlStr);
  if (execRel) {
    return decode(execRel[1]!);
  }
  return null;
}
