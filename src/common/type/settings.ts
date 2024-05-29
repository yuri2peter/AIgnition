import { z } from 'zod';
import { zodSafeString } from '../utils/type';

export const defaultbBookmarkAnalysisTaskPrompt =
  'Summarize this webpage in two sentence based on the following information and screenshots.';
export const defaultbBookmarkAnalysisTaskPromptZh =
  '使用如下信息和网页截图来生成这个网页的摘要（不超过两句话）。';

export const SettingsSchema = z.object({
  geminiKey: zodSafeString(),
  bookmarkAnalysisTaskPrompt: zodSafeString(defaultbBookmarkAnalysisTaskPrompt),
});
