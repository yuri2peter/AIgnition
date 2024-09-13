// https://platform.openai.com/docs/quickstart
import OpenAI from 'openai';
import db from 'src/server/data/db';
import {
  ChatHistory,
  GenerateContent,
  GenerateContentStream,
} from 'src/common/type/ai';
import { TokenBucketRateLimiter } from 'src/common/libs/TokenBucketRateLimiter';
import { waitUntil } from 'src/common/utils/time';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

function getChatModel(key?: string, baseURL?: string) {
  const openai = new OpenAI({
    apiKey: key || db().get().settings.ai.openaiKey,
    baseURL: baseURL || db().get().settings.ai.openaiBaseUrl || undefined,
  });
  return openai;
}

export const generateOpenaiContent: GenerateContent = async (
  prompt: string,
  history: ChatHistory = []
) => {
  await aiRequestLimiter();
  const openai = getChatModel();
  const completion = await openai.chat.completions.create({
    model: db().get().settings.ai.openaiModel,
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      ...historyTostartChatParams(history),
      {
        role: 'user',
        content: prompt,
      },
    ],
  });
  return completion.choices[0]!.message.content!;
};

export const generateOpenaiContentStream: GenerateContentStream = async (
  prompt: string,
  history: ChatHistory = [],
  onUpdate: (totalText: string, chunkText: string) => void
) => {
  await aiRequestLimiter();
  const openai = getChatModel();
  const stream = await openai.chat.completions.create({
    model: db().get().settings.ai.openaiModel,
    stream: true,
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      ...historyTostartChatParams(history),
      {
        role: 'user',
        content: prompt,
      },
    ],
  });
  let str = '';
  for await (const chunk of stream) {
    const chunkText = chunk.choices[0]?.delta?.content || '';
    str += chunkText;
    onUpdate(str, chunkText);
  }
  return str;
};

function historyTostartChatParams(
  history: ChatHistory
): ChatCompletionMessageParam[] {
  const historyFixed: {
    role: 'user' | 'assistant';
    content: string;
  }[] = [];
  history.forEach((h) => {
    historyFixed.push({
      role: 'user',
      content: h.user,
    });
    historyFixed.push({
      role: 'assistant',
      content: h.model,
    });
  });
  return historyFixed;
}

const qpmLimiter = new TokenBucketRateLimiter({
  rate: 15 / 60,
  bucketSize: 60,
});
async function aiRequestLimiter() {
  if (db().get().settings.ai.qpmLimited) {
    await waitUntil(() => qpmLimiter.acquire());
  }
}

export async function checkOpenaiApiKey(key: string, baseURL?: string) {
  try {
    const openai = getChatModel(key, baseURL);
    await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: 'Just say the words: "Hello World"',
        },
      ],
    });
    return true;
  } catch (error) {
    return false;
  }
}
