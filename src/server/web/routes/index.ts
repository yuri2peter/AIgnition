import Router from 'koa-router';
import test from './test';
import settings from './settings';
import miscs from './miscs';

export default function handleRoutes(router: Router<any, {}>) {
  [test, settings, miscs].forEach((t) => t(router));
}
