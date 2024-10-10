import { z } from 'zod';
import {
  zodSafeString,
  zodSafeArray,
  zodSafeTimestamp,
  zodSafeBoolean,
  zodSafeNumber,
} from '../utils/type';

export const ROOT_PAGE_ID = 'ROOT_PAGE';
export const TRASH_PAGE_ID = 'TRASH_PAGE';

export const PageCustomIdSchema = z
  .string()
  .refine((id) => id !== ROOT_PAGE_ID && id !== TRASH_PAGE_ID, {
    message: 'id cannot be ROOT_PAGE or TRASH_PAGE',
  })
  .refine((id) => !id.startsWith('auth'), {
    message: 'id cannot start with "auth"',
  })
  .refine((id) => /^[A-Za-z0-9_-]+$/.test(id), {
    message: 'id can only contain A-Z, a-z, 0-9, -, _',
  });

export const PageSchema = z.object({
  id: zodSafeString(),
  title: zodSafeString(),
  children: zodSafeArray(zodSafeString()), // subPageIds
  isFolder: zodSafeBoolean(), // whether this page is a folder
  isPublicFolder: zodSafeBoolean(), // whether this page is public
  isFavorite: zodSafeBoolean(), // whether this page is favorite
  createdAt: zodSafeTimestamp(), // When this page was created
  updatedAt: zodSafeTimestamp(), // When this page was last updated
  openedAt: zodSafeNumber(), // When this page was last opened
  content: zodSafeString(), // The content of the page
});
export const PagesSchema = zodSafeArray(PageSchema);

export type Page = z.infer<typeof PageSchema>;
export type ComputedPage = Page & {
  computed: {
    isPublic: boolean;
    parent?: string;
    isTrash: boolean;
  };
};
export type Pages = z.infer<typeof PagesSchema>;

// deprecated
export const PrivacyLevelData = [
  {
    label: 'Public',
    value: 0,
    color: 'teal',
    hightlightColor: 'teal',
    tooltip: 'All visitors can view',
  },
  {
    label: 'Normal',
    value: 1,
    color: 'gray',
    hightlightColor: 'blue',
    tooltip: 'Only you can view',
  },
  {
    label: 'Protected',
    value: 2,
    color: 'orange',
    hightlightColor: 'orange',
    tooltip: 'Only you can view. AI tools will be disabled',
  },
];
