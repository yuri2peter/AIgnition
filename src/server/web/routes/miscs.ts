import { Controller } from '../types/controller';
import { IpInfoSchema } from 'src/common/type/ipInfo';

const miscs: Controller = (router) => {
  router.all('/api/miscs/get-server-ip-info', async (ctx) => {
    const res = await fetch('https://api.ipapi.is');
    const data = await res.json();
    ctx.body = IpInfoSchema.parse(data);
  });
};
export default miscs;
