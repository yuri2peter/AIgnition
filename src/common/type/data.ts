import { z } from 'zod';
import { zodSafeType } from '../utils/type';
import { SettingsSchema } from './settings';
import { PagesSchema } from './page';

export const version = 1;
export const DataSchema = z.object({
  settings: zodSafeType(SettingsSchema),
  pages: PagesSchema,
});
export type Data = z.infer<typeof DataSchema>;
export const defaultValue = DataSchema.parse({});
