import { z } from 'zod';
import fs from 'fs-extra';
import extract from 'extract-zip';
import { zip } from 'zip-a-folder';
import { parseByString } from 'bookmark-file-parser';
import { saveUploads } from '../helpers/upload';
import { Controller } from '../types/controller';
import { IpInfoSchema } from 'src/common/type/ipInfo';
import { urlParser1 } from '../helpers/reader1';
import { zodSafeString } from 'src/common/utils/type';
import MemCache from 'src/common/libs/MemCache';
import { TokenBucketRateLimiter } from 'src/common/libs/TokenBucketRateLimiter';
import { waitUntil } from 'src/common/utils/time';
import createMemCacheFilePersistDriver from 'src/common/libs/MemCacheFilePersistDriver';
import path from 'path';
import {
  runtimePath,
  runtimeTempArchiveDirPath,
  runtimeTempArchivePath,
  runtimeTempArchiveZipPath,
  runtimeUploadsPath,
} from 'src/common/paths.app';
import db from 'src/server/data/db';
import { verifyToken } from '../helpers/auth';
import dayjs from 'dayjs';
import { recreateUserGuide } from '../helpers/userGuide';

const miscs: Controller = (router) => {
  router.all('/api/miscs/get-server-ip-info', async (ctx) => {
    const res = await fetch('https://api.ipapi.is');
    const data = await res.json();
    ctx.body = IpInfoSchema.parse(data);
  });

  router.post('/api/miscs/upload', async (ctx) => {
    const field = 'file';
    const file = ctx.request.files?.[field];
    ctx.body = await saveUploads(file);
  });

  const memCacheLinkIcon = new MemCache(
    createMemCacheFilePersistDriver(
      path.resolve(runtimePath, 'data/caches/link_icons.json')
    )
  );
  const iconParserRateLimiter = new TokenBucketRateLimiter({
    rate: 4,
    bucketSize: 6,
  });
  router.post('/api/miscs/parse-link-icon', async (ctx) => {
    if (!verifyToken(ctx) && db().get().settings.linkIconPreview.loggedInOnly) {
      ctx.throw(401);
    }
    const { url } = z
      .object({
        url: zodSafeString(),
      })
      .parse(ctx.request.body);
    const url2 = db().get().settings.general.proxyUrl + url;
    const cacheKey = url2;
    if (memCacheLinkIcon.has(cacheKey)) {
      ctx.body = { icon: memCacheLinkIcon.get(cacheKey) };
    } else {
      await waitUntil(() => iconParserRateLimiter.acquire());
      if (memCacheLinkIcon.has(cacheKey)) {
        ctx.body = { icon: memCacheLinkIcon.get(cacheKey) };
      } else {
        const { icon } = await urlParser1(url2);
        memCacheLinkIcon.set(cacheKey, icon, MemCache.EXPIRE_TIME.ONE_WEEK);
        ctx.body = { icon };
      }
    }
  });

  router.post('/api/miscs/remove-parse-link-icon', async (ctx) => {
    memCacheLinkIcon.removeAll();
    ctx.body = { ok: 1 };
  });

  router.post('/api/miscs/parse-bookmarks', async (ctx) => {
    const { text } = z.object({ text: z.string() }).parse(ctx.request.body);
    const data = parseByString(text);
    ctx.body = data;
  });

  router.post('/api/miscs/delete-unused-uploads', async (ctx) => {
    ctx.body = deleteUnusedUploads();
  });

  let usingTempDir = false;
  router.post('/api/miscs/export-archive', async (ctx) => {
    await waitUntil(() => !usingTempDir, 1000);
    deleteUnusedUploads();
    try {
      usingTempDir = true;
      await fs.ensureDir(runtimeTempArchivePath);
      await fs.emptyDir(runtimeTempArchivePath);
      await fs.ensureDir(runtimeTempArchiveDirPath);
      await fs.copyFile(
        db().file,
        path.resolve(runtimeTempArchiveDirPath, 'main.db')
      );
      await fs.copy(
        runtimeUploadsPath,
        path.resolve(runtimeTempArchiveDirPath, 'uploads')
      );
      await zip(runtimeTempArchiveDirPath, runtimeTempArchiveZipPath);
      ctx.body = { ok: 1 };
    } catch (error) {
      usingTempDir = false;
      ctx.throw(500, 'Internal Server Error');
    } finally {
      usingTempDir = false;
    }
  });

  router.get('/api/miscs/download-archive', async (ctx) => {
    ctx.attachment(`aignition-archive-${dayjs().format('YYYY-MM-DD')}.zip`);
    ctx.type = 'application/zip';
    ctx.body = fs.createReadStream(runtimeTempArchiveZipPath);
  });

  router.post('/api/miscs/import-archive', async (ctx) => {
    await waitUntil(() => !usingTempDir, 1000);
    try {
      usingTempDir = true;
      const field = 'file';
      const file = ctx.request.files?.[field];
      const PersistentFileSchema = z.object({
        filepath: z.string(),
        newFilename: z.string(),
        originalFilename: z.string(),
        mimetype: z.string(),
        size: z.number(),
      });
      const { filepath } = PersistentFileSchema.parse(file);
      await fs.ensureDir(runtimeTempArchivePath);
      await fs.emptyDir(runtimeTempArchivePath);
      await fs.ensureDir(runtimeTempArchiveDirPath);
      await fs.move(filepath, runtimeTempArchiveZipPath);
      await extract(runtimeTempArchiveZipPath, {
        dir: runtimeTempArchiveDirPath,
      });
      await fs.copyFile(
        path.resolve(runtimeTempArchiveDirPath, 'main.db'),
        db().file
      );
      db().loadFile();
      await fs.copy(
        path.resolve(runtimeTempArchiveDirPath, 'uploads'),
        runtimeUploadsPath
      );
      await fs.emptyDir(runtimeTempArchivePath);
      ctx.body = { ok: 1 };
    } catch (error) {
      console.error(error);
      usingTempDir = false;
      ctx.throw(500, 'Internal Server Error');
    } finally {
      usingTempDir = false;
    }
  });

  router.post('/api/miscs/recreate-user-guide', async (ctx) => {
    recreateUserGuide(db().get());
    db().save();
    ctx.body = { ok: 1 };
  });
};
export default miscs;

function deleteUnusedUploads() {
  let sum = 0;
  let deletedCount = 0;
  const dataStr = JSON.stringify(db().get());
  fs.readdirSync(runtimeUploadsPath).forEach((file) => {
    sum++;
    if (!dataStr.includes(file)) {
      fs.unlinkSync(`${runtimeUploadsPath}/${file}`);
      deletedCount++;
    }
  });
  return { sum, deletedCount };
}
