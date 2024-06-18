import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Outlet } from 'react-router-dom';
import { USE_ELECTRON, USE_SOCKET } from 'src/common/config';
import startSocketClient from '../services/startSocketClient';
import testElectronIpc from '../services/testElectronIpc';
import {
  selectSiteLogo,
  selectSiteName,
  useNonSensitiveSettingsStore,
} from '../store/useNonSensitiveSettingsStore';
import { apiErrorHandler } from '../helpers/api';

const AppGuard: React.FC = () => {
  const siteLogo = useNonSensitiveSettingsStore(selectSiteLogo);
  const siteName = useNonSensitiveSettingsStore(selectSiteName);
  const { pullNonSensitiveSettings } = useNonSensitiveSettingsStore(
    (s) => s.actions
  );
  useEffect(() => {
    const cleans: (() => void)[] = [];
    if (USE_SOCKET) {
      const cleanSocket = startSocketClient();
      cleans.push(cleanSocket);
    }
    if (USE_ELECTRON) {
      testElectronIpc();
    }
    pullNonSensitiveSettings().catch(apiErrorHandler);
    return () => {
      cleans.forEach((t) => t());
    };
  }, [pullNonSensitiveSettings]);
  return (
    <>
      <Helmet>
        <title>{siteName}</title>
        <link
          rel="icon"
          type="image/x-icon"
          href={siteLogo || '/assets/icons/png/48x48.png'}
        />
      </Helmet>
      <Outlet />
    </>
  );
};

export default AppGuard;
