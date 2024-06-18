import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

export type Controller = (router: MyRouter) => void;

export type MyRouter = Router<any, {}>;

export type MyContext = ParameterizedContext<
  any,
  Router.IRouterParamContext<any, {}>,
  any
>;
