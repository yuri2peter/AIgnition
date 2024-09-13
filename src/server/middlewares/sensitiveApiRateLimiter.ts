import Koa from 'koa';
import { CounterBasedRateLimiter } from 'src/common/libs/CounterBasedRateLimiter';
import { MyContext } from '../web/types/controller';
import { startsWithMulti } from 'src/common/utils/string';

const checkList = ['/api/auth/request-temp-password'];
const excludeList: string[] = [];

const apiRateLimiter = new CounterBasedRateLimiter({
  max: 2,
  windowSeconds: 20,
});

export default async function sensitiveApiRateLimiter(
  ctx: MyContext,
  next: Koa.Next
) {
  const { ip, url } = ctx.request;
  if (
    startsWithMulti(url, checkList, excludeList) &&
    apiRateLimiter.acquire(ip)
  ) {
    ctx.throw(429, 'Too many requests');
  }
  await next();
}
