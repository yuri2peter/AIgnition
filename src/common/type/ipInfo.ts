import { z } from 'zod';

export const IpInfoSchema = z.object({
  ip: z.string(),
  location: z.object({
    continent: z.string(),
    country: z.string(),
    country_code: z.string(),
    state: z.string(),
    city: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    zip: z.string(),
    timezone: z.string(),
    local_time: z.string(),
  }),
  elapsed_ms: z.number(),
});

export type IpInfo = z.infer<typeof IpInfoSchema>;
