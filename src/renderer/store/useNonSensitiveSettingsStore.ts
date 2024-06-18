import { createSelector } from 'reselect';
import { createZustandStore } from 'src/common/libs/createZustand';
import { SettingsSchema, Settings } from 'src/common/type/settings';
import { api } from '../helpers/api';
import { APP_NAME } from 'src/common/config';

interface Store {
  settings: Settings;
}
const defaultStore = { settings: SettingsSchema.parse({}) };
export const useNonSensitiveSettingsStore = createZustandStore(
  defaultStore,
  (set) => {
    return {
      actions: {
        pullNonSensitiveSettings: async () => {
          await api()
            .post('/api/settings/get-non-sensitive')
            .then(({ data }) => {
              set({ settings: SettingsSchema.parse(data) });
            });
        },
      },
    };
  },
  'NonSensitiveSettings'
);

export const selectSiteLogo = createSelector(
  (s: Store) => s.settings.general.siteLogo,
  (siteLogo) => siteLogo || '/assets/icons/png/48x48.png'
);

export const selectSiteName = createSelector(
  (s: Store) => s.settings.general.siteName,
  (siteName) => siteName || APP_NAME
);
