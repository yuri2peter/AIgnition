import { z } from 'zod';
import { zodSafeString, zodSafeNumber } from '../utils/type';

export const FileDropItemSchema = z.object({
  newFilename: zodSafeString(),
  originalFilename: zodSafeString(),
  mimetype: zodSafeString(),
  size: zodSafeNumber(),
  url: zodSafeString(),
});

export type FileDropItem = z.infer<typeof FileDropItemSchema>;
