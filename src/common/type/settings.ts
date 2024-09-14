import { z } from 'zod';
import { zodSafeBoolean, zodSafeString, zodSafeType } from '../utils/type';

export const GeneralSettingsSchema = z.object({
  siteName: zodSafeString('AIgnition'),
  siteLogo: zodSafeString(),
  defaultPublicFolder: zodSafeString(), // redirect to this folder when guest access home
  proxyUrl: zodSafeString(),
});
export type GeneralSettings = z.infer<typeof GeneralSettingsSchema>;

export const AiSettingsSchema = z.object({
  enabled: zodSafeBoolean(false),
  qpmLimited: zodSafeBoolean(true),
  engine: zodSafeString('gemini'), // gemini, openai
  geminiKey: zodSafeString(),
  geminiBaseUrl: zodSafeString(),
  geminiModel: zodSafeString('gemini-1.5-flash'),
  openaiKey: zodSafeString(),
  openaiBaseUrl: zodSafeString(),
  openaiModel: zodSafeString('gpt-4o'),
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

const LinkIconPreviewSettingsSchema = z.object({
  enabled: zodSafeBoolean(true),
  loggedInOnly: zodSafeBoolean(true),
  filters: zodSafeString('localhost\n127.0.0.1\n'),
});

export const SettingsSchema = z.object({
  general: zodSafeType(GeneralSettingsSchema),
  ai: zodSafeType(AiSettingsSchema),
  giscus: zodSafeType(GiscusSettingsSchema),
  linkIconPreview: zodSafeType(LinkIconPreviewSettingsSchema),
});
export type Settings = z.infer<typeof SettingsSchema>;

export const NonSensitiveSettingsSchema = z.object({
  general: zodSafeType(
    z.object({
      siteName: zodSafeString('AIgnition'),
      siteLogo: zodSafeString(),
      defaultPublicFolder: zodSafeString(),
    })
  ),
  ai: zodSafeType(
    z.object({
      enabled: zodSafeBoolean(false),
    })
  ),
  giscus: zodSafeType(
    z.object({
      enabled: zodSafeBoolean(false),
    })
  ),
  linkIconPreview: zodSafeType(LinkIconPreviewSettingsSchema),
});
export type NonSensitiveSettings = z.infer<typeof NonSensitiveSettingsSchema>;
