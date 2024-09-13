import { Controller } from '../types/controller';
import { saveUploads } from '../helpers/upload';

const test: Controller = (router) => {
  router.all('/api/test', async (ctx) => {
    ctx.body = {};
  });

  router.post('/api/test/upload', async (ctx) => {
    const field = 'test';
    const testFile = ctx.request.files?.[field];
    ctx.body = await saveUploads(testFile);
  });
};
export default test;
