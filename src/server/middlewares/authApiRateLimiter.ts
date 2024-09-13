import Koa from 'koa';
import { CounterBasedRateLimiter } from 'src/common/libs/CounterBasedRateLimiter';
import { MyContext } from '../web/types/controller';
import { startsWithMulti } from 'src/common/utils/string';

const checkList = ['/api/auth'];
const excludeList: string[] = [];

const apiRateLimiter = new CounterBasedRateLimiter({
  max: 20,
  windowSeconds: 30,
});

export default async function authApiRateLimiter(
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
