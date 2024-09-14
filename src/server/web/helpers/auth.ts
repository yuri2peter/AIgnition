import { TOKEN_MAX_AGE } from 'src/common/config';
import { MyContext } from '../types/controller';
import { nanoid } from 'nanoid';
import path from 'path';
import MemCache from 'src/common/libs/MemCache';
import createMemCacheFilePersistDriver from 'src/common/libs/MemCacheFilePersistDriver';
import { runtimePath } from 'src/common/paths.app';
import { passwordHasher } from 'src/common/libs/authTools';

let tempPasswordHashed = nanoid(32);

const authMemCache = new MemCache(
  createMemCacheFilePersistDriver(
    path.resolve(runtimePath, 'data/caches/auth_token.json')
  )
);
export function generateAdminToken() {
  return nanoid(32);
}

export function logoutOtherDevices(ctx: MyContext) {
  const token = getCurrentToken(ctx);
  const storage = authMemCache.storage;
  Object.keys(storage).forEach((k) => {
    if (k !== authMemCache._getPath(token)) {
      authMemCache.remove(k);
    }
  });
}

export function setTempPassword(password: string) {
  tempPasswordHashed = passwordHasher(password);
}

export function getTempPasswordHashed() {
  return tempPasswordHashed;
}

export function applyToken(ctx: MyContext, token: string) {
  authMemCache.set(token, ctx.ip, TOKEN_MAX_AGE);
}

export function removeToken(ctx: MyContext) {
  authMemCache.remove(getCurrentToken(ctx));
}

export function verifyToken(ctx: MyContext) {
  const token = getCurrentToken(ctx);
  if (!authMemCache.get(token)) {
    return false;
  }
  return token;
}

function getCurrentToken(ctx: MyContext) {
  const token = ctx.header.authorization?.replace('Bearer ', '') || '';
  return token;
}
