import { z } from 'zod';
import { zodSafeString } from '../utils/type';

export const AuthSchema = z.object({
  passwordHashed: zodSafeString(),
});
export type Auth = z.infer<typeof AuthSchema>;

export const passwordSchema = z.string().min(8).max(64);
