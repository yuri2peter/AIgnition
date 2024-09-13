import { createSelector } from 'reselect';
import { createZustandStore } from 'src/common/libs/createZustand';
import {
  NonSensitiveSettingsSchema,
  NonSensitiveSettings,
} from 'src/common/type/settings';
import { api } from '../helpers/api';
import { APP_NAME } from 'src/common/config';

interface Store {
  settings: NonSensitiveSettings;
}
const defaultStore = { settings: NonSensitiveSettingsSchema.parse({}) };
export const useNonSensitiveSettingsStore = createZustandStore(
  defaultStore,
  (set) => {
    return {
      actions: {
        pullNonSensitiveSettings: async () => {
          const { data } = await api().post('/api/settings/get-non-sensitive');
          const settings = NonSensitiveSettingsSchema.parse(data);
          set({ settings });
          return settings;
        },
      },
    };
  },
  'NonSensitiveSettings'
);

export const selectSiteLogo = createSelector(
  (s: Store) => s.settings.general.siteLogo,
  (siteLogo) => siteLogo || '/assets/images/logo_square.png'
);

export const selectSiteName = createSelector(
  (s: Store) => s.settings.general.siteName,
  (siteName) => siteName || APP_NAME
);

export const selectAiEnabled = createSelector(
  (s: Store) => s.settings.ai.enabled,
  (enabled) => enabled
);
