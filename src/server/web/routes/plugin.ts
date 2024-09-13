import db from 'src/server/data/db';
import { Controller } from '../types/controller';
import { z } from 'zod';

const plugin: Controller = (router) => {
  router.post('/api/plugin/get-storage', async (ctx) => {
    const { name } = z
      .object({
        name: z.string(),
      })
      .parse(ctx.request.body);
    ctx.body = db().get().pluginStorage[name] || {};
  });

  router.post('/api/plugin/set-storage', async (ctx) => {
    const { name, storage } = z
      .object({
        name: z.string(),
        storage: z.any(),
      })
      .parse(ctx.request.body);
    db().get().pluginStorage[name] = storage || {};
    db().save();
    ctx.body = { ok: 1 };
  });
};
export default plugin;
