// https://ai.google.dev/gemini-api/docs/api-overview
// For a free Gemini API key, RPM(request per minute) should be less than 15.
import fs from 'fs';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  StartChatParams,
} from '@google/generative-ai';
import db from 'src/server/data/db';
import {
  ChatHistory,
  GenerateContent,
  GenerateContentStream,
} from 'src/common/type/ai';
import { TokenBucketRateLimiter } from 'src/common/libs/TokenBucketRateLimiter';
import { waitUntil } from 'src/common/utils/time';

function getChatModel(key?: string, baseURL?: string) {
  const genAI = new GoogleGenerativeAI(key || db().get().settings.ai.geminiKey);
  const model = genAI.getGenerativeModel(
    {
      model: db().get().settings.ai.geminiModel,
      safetySettings,
    },
    {
      baseUrl: baseURL || db().get().settings.ai.geminiBaseUrl || undefined,
    }
  );
  return model;
}

export const generateGeminiContent: GenerateContent = async (
  prompt: string,
  history: ChatHistory = []
) => {
  await aiRequestLimiter();
  const chat = getChatModel().startChat(historyTostartChatParams(history));
  const { response } = await chat.sendMessage(prompt);
  const text = response.text();
  return text;
};

export const generateGeminiContentStream: GenerateContentStream = async (
  prompt: string,
  history: ChatHistory = [],
  onUpdate: (totalText: string, chunkText: string) => void
) => {
  await aiRequestLimiter();
  const chat = getChatModel().startChat(historyTostartChatParams(history));
  const { stream } = await chat.sendMessageStream(prompt);
  let str = '';
  for await (const chunk of stream) {
    const chunkText = chunk.text();
    str += chunkText;
    onUpdate(str, chunkText);
  }
  return str;
};

export async function generateContentWithImage(
  prompt: string,
  imagePath: string
): Promise<string> {
  await aiRequestLimiter();
  const image = {
    inlineData: {
      data: Buffer.from(fs.readFileSync(imagePath)).toString('base64'),
      mimeType: 'image/png',
    },
  };
  const { response } = await getChatModel().generateContent([prompt, image]);
  const text = response.text();
  return text;
}

function historyTostartChatParams(history: ChatHistory): StartChatParams {
  const historyFixed: { role: 'user' | 'model'; parts: { text: string }[] }[] =
    [];
  history.forEach((h) => {
    historyFixed.push({
      role: 'user',
      parts: [{ text: h.user }],
    });
    historyFixed.push({
      role: 'model',
      parts: [{ text: h.model }],
    });
  });
  return {
    history: historyFixed,
  };
}

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

export function cosineSimilarity(vector1: number[], vector2: number[]) {
  if (vector1.length === 0 || vector2.length === 0) return 0;
  const dotProduct = vector1.reduce(
    (sum, val, i) => sum + val * vector2[i]!,
    0
  );
  const norm1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
  const norm2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));

  return dotProduct / (norm1 * norm2);
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

export async function checkGeminiApiKey(key: string, baseURL?: string) {
  try {
    const chat = getChatModel(key, baseURL).startChat();
    await chat.sendMessage('Just say the words: "Hello World"');
    return true;
  } catch (error) {
    return false;
  }
}
