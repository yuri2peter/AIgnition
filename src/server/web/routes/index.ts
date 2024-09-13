import test from './test';
import settings from './settings';
import miscs from './miscs';
import page from './page';
import ai from './ai';
import plugin from './plugin';
import auth from './auth';
import { MyRouter } from '../types/controller';

export default function handleRoutes(router: MyRouter) {
  [test, settings, miscs, page, ai, plugin, auth].forEach((t) => t(router));
}
