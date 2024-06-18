import db from 'src/server/data/db';
import { Controller } from '../types/controller';
import { SettingsSchema } from 'src/common/type/settings';
import { z } from 'zod';
import { cloneDeep } from 'lodash';

const settings: Controller = (router) => {
  router.post('/api/settings/get-all', async (ctx) => {
    ctx.body = db().get().settings;
  });
  router.post('/api/settings/get-non-sensitive', async (ctx) => {
    const settings = cloneDeep(db().get().settings);
    settings.ai.geminiKey = '';
    ctx.body = settings;
  });
  router.post('/api/settings/set-all', async (ctx) => {
    const settings = SettingsSchema.parse(ctx.request.body);
    db().get().settings = settings;
    db().save();
    ctx.body = settings;
  });
  router.post('/api/settings/check-ai-key', async (ctx) => {
    const { key } = z
      .object({ key: z.string().min(1) })
      .parse(ctx.request.body);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
      );
      const data: any = await res.json();
      ctx.body = { ok: res.ok, error: data?.error?.message };
    } catch (error: any) {
      ctx.body = { ok: false, error: error?.message || 'Network error' };
    }
  });
};
export default settings;
