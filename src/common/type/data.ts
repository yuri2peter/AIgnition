import { z } from 'zod';
import { zodSafeType } from '../utils/type';
import { SettingsSchema } from './settings';

export const version = 1;
export const DataSchema = z.object({
  settings: zodSafeType(SettingsSchema),
});
export type Data = z.infer<typeof DataSchema>;
export const defaultValue = DataSchema.parse({});
