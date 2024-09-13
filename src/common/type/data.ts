import { z } from 'zod';
import { zodSafeType } from '../utils/type';
import { SettingsSchema } from './settings';
import { PagesSchema } from './page';
import { AuthSchema } from './auth';

export const DataSchema = z.object({
  settings: zodSafeType(SettingsSchema),
  pages: PagesSchema,
  pluginStorage: zodSafeType(z.record(z.any()), {}),
  auth: zodSafeType(AuthSchema),
});
export type Data = z.infer<typeof DataSchema>;
export const defaultValue = DataSchema.parse({});
