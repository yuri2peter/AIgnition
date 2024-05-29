/* eslint-disable @typescript-eslint/no-unused-vars */
import { StateCreator, create } from 'zustand';
import { combine, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export function createZustandStore<T extends object, U extends object>(
  a: T,
  b: StateCreator<T, [['zustand/immer', never]], [], U>,
  persistName = ''
) {
  const creator = subscribeWithSelector(immer(combine(a, b)));
  if (persistName) {
    return create(
      persist(creator, {
        name: persistName,
        partialize: ({ actions, ...rest }: any) => rest,
      })
    );
  } else {
    return create(creator);
  }
}
