import test from './test';
import settings from './settings';
import miscs from './miscs';
import page from './page';
import ai from './ai';
import { MyRouter } from '../types/controller';

export default function handleRoutes(router: MyRouter) {
  [test, settings, miscs, page, ai].forEach((t) => t(router));
}
