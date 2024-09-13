import db, { getDefaultRootPage } from 'src/server/data/db';
import { Controller } from '../types/controller';
import { Page, PageCustomIdSchema, PageSchema } from 'src/common/type/page';
import { getParsedId } from 'src/common/utils/type';
import { z } from 'zod';
import { cloneDeep } from 'lodash';
import { encode } from 'js-base64';
import { shortId } from 'src/common/utils/string';
import {
  changeNodeId,
  deleteNode,
  getAncestorsNodes,
  getCurrentTreeNodeRelated,
  getDescendantsNodes,
} from 'src/common/utils/tree';
import MemCache from 'src/common/libs/MemCache';

const page: Controller = (router) => {
  router.post('/api/page/get-all-items', async (ctx) => {
    ctx.body = db().get().pages;
  });

  // For guest preview, base64encoded, cached
  const gusetPagesMemCache = new MemCache();
  router.post('/api/page/get-guest-items', async (ctx) => {
    const id = getParsedId(ctx.request.body);
    const valueCached = gusetPagesMemCache.get(id);
    if (valueCached) {
      ctx.body = {
        pages: valueCached,
      };
      return;
    }
    const item = findPage(id);
    if (!item) {
      ctx.throw(404);
      return;
    }
    const pages = db().get().pages;
    const ancestorsNodes = getAncestorsNodes(pages, item);
    const rootNode = [...ancestorsNodes, item].find((t) => t.isPublicFolder);
    if (!rootNode) {
      ctx.throw(403, 'Not a public folder');
      return;
    }
    const descendantsNodes = getDescendantsNodes(pages, rootNode);
    const value = encode(JSON.stringify([rootNode, ...descendantsNodes]));
    gusetPagesMemCache.set(id, value, 120);
    ctx.body = {
      pages: value, // base64
    };
  });

  router.post('/api/page/remove-guest-pages-cache', async (ctx) => {
    gusetPagesMemCache.removeAll();
    ctx.body = { ok: 1 };
  });

  router.post('/api/page/get-item', async (ctx) => {
    const id = getParsedId(ctx.request.body);
    const item = findPage(id);
    if (!item) {
      ctx.throw(404, 'Page not found.');
      return;
    }
    ctx.body = item;
  });

  router.post('/api/page/create-item', async (ctx) => {
    const { item, parent } = z
      .object({
        item: PageSchema,
        parent: z.string(),
      })
      .parse(ctx.request.body);

    const parentPage = findPage(parent);
    if (!parentPage || !parentPage.isFolder) {
      ctx.throw(422, 'Parent is not a folder.');
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
    parentPage.children.push(id);
    db().save();
    ctx.body = itemFixed;
  });

  function patchItem({ id, ...changes }: Partial<Page> & { id: string }) {
    const item = findPage(id)!;
    const contentChanged =
      changes.content !== undefined && item.content !== changes.content;
    const itemFixed: Page = {
      ...item,
      ...changes,
      ...(contentChanged ? { updatedAt: Date.now() } : {}),
    };
    Object.assign(item, PageSchema.parse(itemFixed));

    db().save();
    return item;
  }

  router.post('/api/page/patch-item', async (ctx) => {
    const id = getParsedId(ctx.request.body);
    const item = findPage(id);
    if (!item) {
      ctx.throw(404);
      return;
    }
    ctx.body = patchItem(ctx.request.body);
  });

  router.post('/api/page/delete-item', async (ctx) => {
    const id = getParsedId(ctx.request.body);
    const item = findPage(id);
    if (!item) {
      ctx.throw(404);
      return;
    }
    const { pages } = db().get();
    db().get().pages = deleteNode(pages, item);
    db().save();
    ctx.body = { ok: 1 };
  });

  router.post('/api/page/duplicate-item', async (ctx) => {
    const id = getParsedId(ctx.request.body);
    const item = findPage(id);
    if (!item) {
      ctx.throw(404);
      return;
    }
    const { pages } = db().get();
    const nowTime = Date.now();
    const { parentNode, descendantsNodes, currentNode, parentChildrenIndex } =
      getCurrentTreeNodeRelated(pages, item);
    if (!parentNode || parentChildrenIndex < 0) {
      ctx.throw(422, 'Parent not found.');
      return;
    }
    const cloneSubTree = cloneDeep([currentNode, ...descendantsNodes]);
    const traversal = (node: Page, parent: Page) => {
      const newId = shortId();
      parent.children = parent.children.map((t) => (t === node.id ? newId : t));
      node.id = newId;
      node.createdAt = nowTime;
      node.children.forEach((child) => {
        const childNode = cloneSubTree.find((t) => t.id === child)!;
        traversal(childNode, node);
      });
    };
    const newPage = cloneSubTree.find((t) => t.id === item.id)!;
    newPage.id = shortId();
    parentNode.children.splice(parentChildrenIndex + 1, 0, newPage.id);
    traversal(newPage, parentNode);
    pages.push(...cloneSubTree);
    db().save();
    ctx.body = newPage;
  });

  router.post('/api/page/change-id', async (ctx) => {
    const { from, to } = z
      .object({
        from: z.string(),
        to: z.string(),
      })
      .parse(ctx.request.body);
    const pageFrom = findPage(from);
    const pageTo = findPage(to);
    if (!pageFrom) {
      ctx.throw(404, 'page not found');
      return;
    }
    // conflict
    if (pageTo) {
      ctx.throw(400, 'id conflict');
      return;
    }
    // new ID should follow rules
    const { success, error } = PageCustomIdSchema.safeParse(to);
    if (!success) {
      ctx.throw(400, error);
      return;
    }
    changeNodeId(db().get().pages, pageFrom, to);
    db().save();
    ctx.body = { ok: 1 };
  });

  router.post('/api/page/reset-data', async (ctx) => {
    db().get().pages = [getDefaultRootPage()];
    db().save();
    ctx.body = { ok: 1 };
  });
};

export default page;

function findPage(id: string) {
  return db()
    .get()
    .pages.find((item) => item.id === id);
}
