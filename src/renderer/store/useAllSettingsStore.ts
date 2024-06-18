import { createZustandStore } from 'src/common/libs/createZustand';
import { Settings, SettingsSchema } from 'src/common/type/settings';
import { api } from '../helpers/api';
import { useNonSensitiveSettingsStore } from './useNonSensitiveSettingsStore';

const defaultStore = { settings: SettingsSchema.parse({}) };
export const useAllSettingsStore = createZustandStore(defaultStore, (set) => {
  return {
    actions: {
      pullAllSettings: async () => {
        await api()
          .post('/api/settings/get-all')
          .then(({ data }) => {
            set({ settings: SettingsSchema.parse(data) });
          });
      },
      pushAllSettings: async (values: Settings) => {
        await api()
          .post('/api/settings/set-all', values)
          .then(({ data }) => {
            set({ settings: SettingsSchema.parse(data) });
          });
        await useNonSensitiveSettingsStore
          .getState()
          .actions.pullNonSensitiveSettings();
      },
      clearLocalSettings: () => {
        set({ settings: SettingsSchema.parse({}) });
      },
    },
  };
});
