import { z } from 'zod';
import { zodSafeBoolean, zodSafeString, zodSafeType } from '../utils/type';

export const GeneralSettingsSchema = z.object({
  siteName: zodSafeString('Aignition'),
  siteLogo: zodSafeString(),
});
export type GeneralSettings = z.infer<typeof GeneralSettingsSchema>;

export const AiSettingsSchema = z.object({
  enabled: zodSafeBoolean(false),
  geminiKey: zodSafeString(),
});
export type AiSettings = z.infer<typeof AiSettingsSchema>;

export const GiscusSettingsSchema = z.object({
  enabled: zodSafeBoolean(false),
  repo: zodSafeString(),
  repoId: zodSafeString(),
  category: zodSafeString(),
  categoryId: zodSafeString(),
});
export type GiscusSettings = z.infer<typeof GiscusSettingsSchema>;

export const SettingsSchema = z.object({
  general: zodSafeType(GeneralSettingsSchema),
  ai: zodSafeType(AiSettingsSchema),
  giscus: zodSafeType(GiscusSettingsSchema),
});
export type Settings = z.infer<typeof SettingsSchema>;
