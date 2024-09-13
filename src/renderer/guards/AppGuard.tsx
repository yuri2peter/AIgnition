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
import { useRootStore } from '../store/useRootStore';
import { tryRenewTokenIfLoggedIn } from '../store/useUserStore';
import { Box } from '@mantine/core';
import { navigate } from '../hacks/navigate';
import { getPageRoute } from '../helpers/miscs';

const AppGuard: React.FC = () => {
  const siteLogo = useNonSensitiveSettingsStore(selectSiteLogo);
  const siteName = useNonSensitiveSettingsStore(selectSiteName);
  const { setAppReady, setServerError } = useRootStore((s) => s.actions);
  const serverError = useRootStore((s) => s.serverError);
  const appReady = useRootStore((s) => s.appReady);
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
    (async () => {
      try {
        const {
          general: { defaultPublicFolder },
        } = await pullNonSensitiveSettings();
        const loggedIn = await tryRenewTokenIfLoggedIn();
        if (!loggedIn && defaultPublicFolder) {
          navigate(getPageRoute(defaultPublicFolder));
        }
        requestAnimationFrame(() => setAppReady(true));
      } catch (error) {
        apiErrorHandler(error);
        setServerError(true);
      }
    })();
    return () => {
      cleans.forEach((t) => t());
    };
  }, [pullNonSensitiveSettings, setAppReady, setServerError]);
  const content = (() => {
    if (serverError) {
      return <RenderServerError />;
    }
    if (!appReady) {
      return null;
    }
    return <Outlet />;
  })();
  return (
    <>
      <Helmet>
        <title>{siteName}</title>
        <link rel="icon" type="image/x-icon" href={siteLogo} />
      </Helmet>
      {content}
    </>
  );
};

function RenderServerError() {
  return <Box>Server Error</Box>;
}

export default AppGuard;
