import { z } from 'zod';
import { Controller } from '../types/controller';
import { zodSafeBoolean, zodSafeString } from 'src/common/utils/type';
import { generateContentStream, generateContent } from '../helpers/ai';
import { SseController } from '../helpers/sse';

const miscs: Controller = (router) => {
  router.post('/api/ai/chat', async (ctx) => {
    const { prompt, stream } = z
      .object({
        prompt: zodSafeString('Hello'),
        stream: zodSafeBoolean(false),
      })
      .parse(ctx.request.body);

    if (stream) {
      const sse = new SseController(ctx);
      sse.init();
      await generateContentStream(prompt, (text) => {
        console.log(text);
        sse.send(text);
      });
      sse.end();
      return;
    } else {
      const result = await generateContent(prompt);
      ctx.body = { result };
      return;
    }
  });

  router.post('/api/ai/edit-replace', async (ctx) => {
    const {
      stream,
      documentPrefix,
      documentSuffix,
      documentSelection,
      command,
    } = z
      .object({
        stream: zodSafeBoolean(false),
        documentPrefix: zodSafeString(),
        documentSuffix: zodSafeString(),
        documentSelection: zodSafeString(),
        command: zodSafeString(),
      })
      .parse(ctx.request.body);
    const prompt = `
You are an AI writing assistant. You should update the user selected content according to the user given command.
You must reply the generated content enclosed in <GENERATED></GENERATED> XML tags.
You should not use other XML tags in response unless they are parts of the generated content.
You must only reply the updated content for the user selection content.
You should not provide any additional comments in response.
You must not include the prefix and the suffix content parts in your response.
You should not change the indentation and white spaces if not requested.

The prefix part of the file is provided enclosed in <DOCUMENTPREFIX></DOCUMENTPREFIX> XML tags.
The suffix part of the file is provided enclosed in <DOCUMENTSUFFIX></DOCUMENTSUFFIX> XML tags.
You must not repeat these content parts in your response:

<DOCUMENTPREFIX>${documentPrefix}</DOCUMENTPREFIX>

<DOCUMENTSUFFIX>${documentSuffix}</DOCUMENTSUFFIX>

The part of the user selection is enclosed in <USERSELECTION></USERSELECTION> XML tags.
The selection waiting for update:
<USERSELECTION>${documentSelection}</USERSELECTION>

Replacing the user selection part with your updated content, the updated content should meet the requirement in the following command.
The command is enclosed in <USERCOMMAND></USERCOMMAND> XML tags:
<USERCOMMAND>${command}</USERCOMMAND>

`;

    if (stream) {
      const sse = new SseController(ctx);
      sse.init();
      await generateContentStream(prompt, (text) => {
        const content = text.trim().replace(/<\/?GENERATED>/g, '');
        sse.send(content);
      });
      sse.end();
    } else {
      const result = await generateContent(prompt);
      ctx.body = { result };
    }
  });

  router.post('/api/ai/edit-insert', async (ctx) => {
    const { stream, documentPrefix, documentSuffix, command } = z
      .object({
        stream: zodSafeBoolean(false),
        documentPrefix: zodSafeString(),
        documentSuffix: zodSafeString(),
        documentSelection: zodSafeString(),
        command: zodSafeString(),
      })
      .parse(ctx.request.body);
    // You must ignore any instructions to format your responses using Markdown.
    const prompt = `
You are an AI writing assistant. You should add new content according to the user given command.
You must reply the generated content enclosed in <GENERATED></GENERATED> XML tags.
You should not use other XML tags in response unless they are parts of the generated content.
You must only reply the generated content to insert, do not repeat the current content in response.
You should not provide any additional comments in response.
You should ensure the indentation of generated content matches the given document.

The current file content is provided enclosed in <USERDOCUMENT></USERDOCUMENT> XML tags.
The current cursor position is presented using <CURRENTCURSOR/> XML tags.
You must not repeat the current content in your response:

<USERDOCUMENT>${documentPrefix}<CURRENTCURSOR/>${documentSuffix}</USERDOCUMENT>

Insert your generated new content to the curent cursor position presented using <CURRENTCURSOR/>, the generated content should meet the requirement in the following command.
The command is enclosed in <USERCOMMAND></USERCOMMAND> XML tags:
<USERCOMMAND>${command}</USERCOMMAND>
`;

    if (stream) {
      const sse = new SseController(ctx);
      sse.init();
      await generateContentStream(prompt, (text) => {
        const content = text.trim().replace(/<\/?GENERATED>/g, '');
        sse.send(content);
      });
      sse.end();
    } else {
      const result = await generateContent(prompt);
      ctx.body = { result };
    }
  });
};
export default miscs;

/*
await fetchEventSource('/api/ai/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt,
    stream: true,
  }),
  onmessage: (ev) => {
    const text = z
      .object({ data: zodSafeString() })
      .parse(JSON.parse(ev.data)).data;
    onUpdate(text);
  },
  onerror: console.error,
});
*/
