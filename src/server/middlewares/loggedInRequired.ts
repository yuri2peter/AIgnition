import Koa from 'koa';
import { MyContext } from '../web/types/controller';
import { startsWithMulti } from 'src/common/utils/string';
import { verifyToken } from '../web/helpers/auth';

const checkList = ['/api/'];
const excludeList: string[] = [
  '/api/auth/login-password',
  '/api/auth/request-temp-password',
  '/api/miscs/download-archive',
  '/api/miscs/parse-link-icon',
  '/api/page/get-guest-items',
  '/api/settings/get-non-sensitive',
  '/api/auth/token-renew',
];

export default async function loggedInRequired(ctx: MyContext, next: Koa.Next) {
  const { url } = ctx.request;
  if (startsWithMulti(url, checkList, excludeList) && !verifyToken(ctx)) {
    ctx.throw(401);
  }
  await next();
}
