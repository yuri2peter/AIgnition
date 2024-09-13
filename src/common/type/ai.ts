import { z } from 'zod';
import { zodSafeArray, zodSafeString } from '../utils/type';

export const ChatHistorySchema = zodSafeArray(
  z.object({
    user: zodSafeString(),
    model: zodSafeString(),
  })
);
export type ChatHistory = z.infer<typeof ChatHistorySchema>;
export type GenerateContent = (
  prompt: string,
  history?: ChatHistory
) => Promise<string>;
export type GenerateContentStream = (
  prompt: string,
  history: ChatHistory | undefined,
  onUpdate: (totalText: string, chunkText: string) => void
) => Promise<string>;
