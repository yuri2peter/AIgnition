import db from 'src/server/data/db';
import { Controller } from '../types/controller';
import {
  NonSensitiveSettingsSchema,
  SettingsSchema,
} from 'src/common/type/settings';
import { z } from 'zod';
import { checkGeminiApiKey } from 'src/server/libs/ai/gemini';
import { checkOpenaiApiKey } from 'src/server/libs/ai/openai';

const settings: Controller = (router) => {
  router.post('/api/settings/get-all', async (ctx) => {
    ctx.body = db().get().settings;
  });
  router.post('/api/settings/get-non-sensitive', async (ctx) => {
    const s = db().get().settings;
    ctx.body = NonSensitiveSettingsSchema.parse(s);
  });

  router.post('/api/settings/set-all', async (ctx) => {
    const settings = SettingsSchema.parse(ctx.request.body);
    db().get().settings = settings;
    db().save();
    ctx.body = settings;
  });

  router.post('/api/settings/check-gemini-key', async (ctx) => {
    const { key, baseURL } = z
      .object({ key: z.string().min(1), baseURL: z.string() })
      .parse(ctx.request.body);
    const checked = await checkGeminiApiKey(key, baseURL);
    ctx.body = {
      ok: checked,
      error: checked ? '' : 'API key not available or network error',
    };
  });

  router.post('/api/settings/check-openai-key', async (ctx) => {
    const { key, baseURL } = z
      .object({ key: z.string().min(1), baseURL: z.string() })
      .parse(ctx.request.body);
    const checked = await checkOpenaiApiKey(key, baseURL);
    ctx.body = {
      ok: checked,
      error: checked ? '' : 'API key not available or network error',
    };
  });
};
export default settings;
