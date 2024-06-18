import db from 'src/server/data/db';
import { Controller } from '../types/controller';
import { Page, PageInfosSchema, PageSchema } from 'src/common/type/page';
import { getParsedId } from 'src/common/utils/type';
import { findFlatRelatives } from 'src/common/utils/tree';
import { z } from 'zod';
import { cloneDeep, now } from 'lodash';
import { shortId } from 'src/common/utils/string';

const page: Controller = (router) => {
  router.post('/api/page/get-infos', async (ctx) => {
    ctx.body = PageInfosSchema.parse(db().get().pages);
  });

  router.post('/api/page/get-recent-pages', async (ctx) => {
    ctx.body = Array.from(db().get().pages)
      .sort(
        (a, b) =>
          Math.max(b.privateViewAt, b.publicViewAt) -
          Math.max(a.privateViewAt, a.publicViewAt)
      )
      .slice(0, 10);
  });

  router.post('/api/page/get-item', async (ctx) => {
    const id = getParsedId(ctx.request.body);
    const item = findPage(id);
    if (!item) {
      ctx.throw(404);
      return;
    }
    ctx.body = item;
  });

  router.post('/api/page/create-item', async (ctx) => {
    const { item, parentId } = z
      .object({
        item: PageSchema,
        parentId: z.string(),
      })
      .parse(ctx.request.body);

    const parentPage = findPage(parentId);
    if (!parentPage) {
      ctx.throw(404);
      return;
    }
    const id = shortId();
    const itemFixed: Page = {
      ...item,
      id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    db().get().pages.push(itemFixed);
    parentPage.childrenIds.push(id);
    db().save();
    ctx.body = itemFixed;
  });

  router.post('/api/page/patch-item', async (ctx) => {
    const id = getParsedId(ctx.request.body);
    const item = findPage(id);
    if (!item) {
      ctx.throw(404);
      return;
    }
    const itemFixed: Page = {
      ...item,
      ...ctx.request.body,
      updatedAt: Date.now(),
    };
    PageSchema.parse(itemFixed);
    Object.assign(item, itemFixed);
    db().save();
    ctx.body = item;
  });

  router.post('/api/page/delete-item', async (ctx) => {
    const id = getParsedId(ctx.request.body);
    const item = findPage(id);
    if (!item) {
      ctx.throw(404);
      return;
    }
    const { selfInclusive, parent } = findFlatRelatives(db().get().pages, id);
    const relativeIds = selfInclusive.map((t) => t.id);
    db().get().pages = db()
      .get()
      .pages.filter((t) => !relativeIds.includes(t.id));
    parent.childrenIds = parent.childrenIds.filter((t) => t !== id);
    db().save();
    ctx.body = { ok: 1 };
  });

  router.post('/api/page/log-private-view', async (ctx) => {
    const id = getParsedId(ctx.request.body);
    const item = findPage(id);
    if (!item) {
      ctx.throw(404);
      return;
    }
    item.privateViews += 1;
    item.privateViewAt = Date.now();
    db().save();
    ctx.body = item;
  });

  router.post('/api/page/log-public-view', async (ctx) => {
    const id = getParsedId(ctx.request.body);
    const item = findPage(id);
    if (!item) {
      ctx.throw(404);
      return;
    }
    item.publicViews += 1;
    item.publicViewAt = Date.now();
    db().save();
    ctx.body = item;
  });

  router.post('/api/page/cut-to-page', async (ctx) => {
    const { from, to, start } = z
      .object({
        from: z.string(),
        to: z.string(),
        start: z.number(), // 0: above, 1, below
      })
      .parse(ctx.request.body);
    const pageFrom = findPage(from);
    const pageTo = findPage(to);
    if (!pageFrom || !pageTo) {
      ctx.throw(404);
      return;
    }
    const { pages } = db().get();
    const { selfInclusive, parent: parentFrom } = findFlatRelatives(
      pages,
      from
    );
    if (selfInclusive.find((t) => t.id === to)) {
      ctx.throw(400);
      return;
    }
    parentFrom.childrenIds = parentFrom.childrenIds.filter((t) => t !== from);
    const {
      parent: { childrenIds: parentToChildrenIds },
    } = findFlatRelatives(pages, to);
    const toIndex = parentToChildrenIds.findIndex((t) => t === to);
    parentToChildrenIds.splice(toIndex + start, 0, from);
    db().save();
    ctx.body = { id: from };
  });

  router.post('/api/page/cut-to-subpage', async (ctx) => {
    const { from, to } = z
      .object({
        from: z.string(),
        to: z.string(),
      })
      .parse(ctx.request.body);
    const pageFrom = findPage(from);
    const pageTo = findPage(to);
    if (!pageFrom || !pageTo) {
      ctx.throw(404);
      return;
    }
    const { pages } = db().get();
    const { selfInclusive, parent: parentFrom } = findFlatRelatives(
      pages,
      from
    );
    if (selfInclusive.find((t) => t.id === to)) {
      ctx.throw(400);
      return;
    }
    parentFrom.childrenIds = parentFrom.childrenIds.filter((t) => t !== from);
    pageTo.childrenIds.push(from);
    db().save();
    ctx.body = { id: from };
  });

  router.post('/api/page/copy-to-page', async (ctx) => {
    const { from, to, start } = z
      .object({
        from: z.string(),
        to: z.string(),
        start: z.number(), // 0: above, 1, below
      })
      .parse(ctx.request.body);
    const pageFrom = findPage(from);
    const pageTo = findPage(to);
    if (!pageFrom || !pageTo) {
      ctx.throw(404);
      return;
    }
    const { pages } = db().get();
    const { children } = findFlatRelatives(pages, from);
    if (children.find((t) => t.id === to)) {
      ctx.throw(400);
      return;
    }
    const newId = clonePage(pageFrom);
    const {
      parent: { childrenIds: parentToChildrenIds },
    } = findFlatRelatives(pages, to);
    const toIndex = parentToChildrenIds.findIndex((t) => t === to);
    parentToChildrenIds.splice(toIndex + start, 0, newId);
    db().save();
    ctx.body = { id: newId };
  });

  router.post('/api/page/copy-to-subpage', async (ctx) => {
    const { from, to } = z
      .object({
        from: z.string(),
        to: z.string(),
      })
      .parse(ctx.request.body);
    const pageFrom = findPage(from);
    const pageTo = findPage(to);
    if (!pageFrom || !pageTo) {
      ctx.throw(404);
      return;
    }
    const { pages } = db().get();
    const { selfInclusive } = findFlatRelatives(pages, from);
    if (selfInclusive.find((t) => t.id === to)) {
      ctx.throw(400);
      return;
    }
    const newId = clonePage(pageFrom);
    pageTo.childrenIds.push(newId);
    db().save();
    ctx.body = { id: newId };
  });
};

export default page;

function findPage(id: string) {
  return db()
    .get()
    .pages.find((item) => item.id === id);
}

function clonePage(page: Page) {
  const cloneSelf = { ...cloneDeep(page), createAt: now(), updatedAt: now() };
  db().get().pages.push(cloneSelf);
  const newId = shortId();
  cloneSelf.id = newId;
  cloneSelf.childrenIds.forEach((c) => {
    const cPage = findPage(c);
    if (cPage) {
      const newCId = clonePage(cPage);
      const oldCIdIndex = cloneSelf.childrenIds.findIndex((t) => t === c);
      cloneSelf.childrenIds.splice(oldCIdIndex, 1, newCId);
    }
  });
  return newId;
}
