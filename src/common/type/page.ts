import { z } from 'zod';
import {
  zodSafeString,
  zodSafeNumber,
  zodSafeBoolean,
  zodSafeArray,
} from '../utils/type';

export const ROOT_PAGE_ID = 'ROOT_PAGE';

export const PageInfoSchema = z.object({
  id: zodSafeString(),
  childrenIds: zodSafeArray(zodSafeString()),
  title: zodSafeString(),
  isPublic: zodSafeBoolean(), // Is this page public to other users?
  createdAt: zodSafeNumber(), // When this page was created
  updatedAt: zodSafeNumber(), // When this page was last updated
});
export const PageInfosSchema = zodSafeArray(PageInfoSchema);

export const PageSchema = PageInfoSchema.extend({
  privateViews: zodSafeNumber(), // Number of private views
  privateViewAt: zodSafeNumber(), // When this page was last private view
  publicViews: zodSafeNumber(), // Number of public views
  publicViewAt: zodSafeNumber(), // When this page was last public view
  content: zodSafeString(), // The content of the page
});
export const PagesSchema = zodSafeArray(PageSchema);

export type PageInfo = z.infer<typeof PageInfoSchema>;
export type PageInfos = z.infer<typeof PageInfosSchema>;
export type Page = z.infer<typeof PageSchema>;
export type Pages = z.infer<typeof PagesSchema>;
