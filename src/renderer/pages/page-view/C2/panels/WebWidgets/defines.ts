import { z } from 'zod';
import { zodSafeArray, zodSafeString } from 'src/common/utils/type';
import { createContext } from 'react';

export const WebWidgetsSchema = z.object({
  id: z.string().min(1),
  name: zodSafeString(),
  content: zodSafeString(),
  height: z.number().min(50).default(400),
});

export type WebWidgets = z.infer<typeof WebWidgetsSchema>;

export const schema = z.object({
  gadgets: zodSafeArray(WebWidgetsSchema),
});

export type ChangeStorage = (
  recipe: (draft: z.infer<typeof schema>) => void
) => void;

export const WebWidgetContext = createContext<{
  changeStorage: ChangeStorage;
  dragging: boolean;
  setDragging: (d: boolean) => void;
}>({
  changeStorage: () => {},
  dragging: false,
  setDragging: () => {},
});
