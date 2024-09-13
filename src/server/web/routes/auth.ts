import { z } from 'zod';
import { Controller } from '../types/controller';
import db from 'src/server/data/db';
import { nanoid } from 'nanoid';
import { fileLog } from 'src/server/utils/log';
import {
  generateAdminToken,
  getTempPasswordHashed,
  applyToken,
  removeToken,
  logoutOtherDevices,
  setTempPassword,
  verifyToken,
} from '../helpers/auth';

const auth: Controller = (router) => {
  router.post('/api/auth/login-password', async (ctx) => {
    const { passwordHashed } = z
      .object({ passwordHashed: z.string() })
      .parse(ctx.request.body);
    const verified =
      db().get().auth.passwordHashed === passwordHashed ||
      getTempPasswordHashed() === passwordHashed;
    if (!verified) {
      ctx.throw(401, 'Password is not correct');
      return;
    }
    const token = generateAdminToken();
    applyToken(ctx, token);
    fileLog(`User ${ctx.request.ip} logged in.`, 'auth');
    ctx.body = { ok: 1 };
  });

  router.post('/api/auth/token-renew', async (ctx) => {
    const isNewInstance = db().get().auth.passwordHashed === '';
    if (!isNewInstance && !verifyToken(ctx)) {
      ctx.throw(401, 'Unauthorized');
      return;
    }
    const token = generateAdminToken();
    applyToken(ctx, token);
    fileLog(`User ${ctx.request.ip} renewed token.`, 'auth');
    ctx.body = { ok: 1, isNewInstance };
  });

  router.post('/api/auth/logout', async (ctx) => {
    removeToken(ctx);
    fileLog(`User ${ctx.request.ip} logged out.`, 'auth');
    ctx.body = { ok: 1 };
  });

  router.post('/api/auth/logout-other-devices', async (ctx) => {
    logoutOtherDevices(ctx);
    ctx.body = { ok: 1 };
  });

  router.post('/api/auth/request-temp-password', async (ctx) => {
    const tempPassword = nanoid(12);
    setTempPassword(tempPassword);
    fileLog(
      `User ${ctx.request.ip} requested a temp password: ${tempPassword}`,
      'auth'
    );
    ctx.body = { ok: 1 };
  });

  router.post('/api/auth/update-password', async (ctx) => {
    const { passwordHashed } = z
      .object({ passwordHashed: z.string() })
      .parse(ctx.request.body);
    db().get().auth.passwordHashed = passwordHashed;
    db().save();
    logoutOtherDevices(ctx);
    fileLog(`User ${ctx.request.ip} updated password.`, 'auth');
    ctx.body = { ok: 1 };
  });
};
export default auth;
