import { Controller } from '../types/controller';
import { saveUploads } from '../helpers/upload';
import { urlParser2 } from '../helpers/reader2';

const test: Controller = (router) => {
  router.all('/api/test', async (ctx) => {
    const { url } = ctx.request.body;
    const content = await urlParser2(url);
    ctx.body = { content };
  });
  router.post('/api/test/upload', async (ctx) => {
    const field = 'test';
    const testFile = ctx.request.files?.[field];
    ctx.body = await saveUploads(testFile);
  });
};
export default test;
