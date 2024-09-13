import Koa from 'koa';
import Router from 'koa-router';
import onerror from 'koa-onerror';
import bodyPaser from 'koa-body';
import http from 'http';
import path from 'path';
import CSRF from 'koa-csrf';
import koaPushState from 'koa-push';
import staticServer from 'koa-static-prefix';
import cors from '@koa/cors';
import {
  MAX_UPLOAD_FILE_SIZE,
  UPLOADS_URL_PREFIX,
  USE_CORS,
} from 'src/common/config';
import { runtimeUploadsPath, rendererPath } from 'src/common/paths.app';
import handleRoutes from './routes';
import { MyRouter } from './types/controller';
import genericApiRateLimiter from '../middlewares/genericApiRateLimiter';
import authApiRateLimiter from '../middlewares/authApiRateLimiter';
import sensitiveApiRateLimiter from '../middlewares/sensitiveApiRateLimiter';
import loggedInRequired from '../middlewares/loggedInRequired';

export default function startKoa() {
  const app = new Koa();
  applyApp(app);
  return http.createServer(app.callback());
}

function applyApp(app: Koa) {
  onerror(app);
  USE_CORS && app.use(cors());
  app.use(new CSRF());
  useApiInterpreter(app);
  useUpload(app);
  useRoutes(app);
  app.use(staticServer(rendererPath));
  app.use(
    staticServer(runtimeUploadsPath, {
      pathPrefix: UPLOADS_URL_PREFIX,
    })
  );
  app.use(
    koaPushState(path.resolve(rendererPath, 'index.html'), (ctx) => {
      const { request } = ctx;
      return (
        request.method === 'GET' &&
        !request.path.startsWith('/api/') &&
        !request.path.includes('.')
      );
    })
  );
}

function useUpload(app: Koa) {
  app.use(
    bodyPaser({
      jsonLimit: '100mb',
      multipart: true,
      onError(err, ctx) {
        ctx.throw(422, 'body parse error');
      },
      formidable: MAX_UPLOAD_FILE_SIZE
        ? {
            uploadDir: runtimeUploadsPath,
            maxTotalFileSize: MAX_UPLOAD_FILE_SIZE,
            multiples: true,
            // "onFileBegin" somehow broken in this case
          }
        : undefined,
    })
  );
}

function useRoutes(app: Koa) {
  const router = new Router();
  app.use(router.routes());
  handleRoutes(router as unknown as MyRouter);
}

function useApiInterpreter(app: Koa) {
  app.use(loggedInRequired);
  app.use(genericApiRateLimiter);
  app.use(authApiRateLimiter);
  app.use(sensitiveApiRateLimiter);
}
