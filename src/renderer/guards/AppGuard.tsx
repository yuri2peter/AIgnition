import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Outlet } from 'react-router-dom';
import { APP_NAME, USE_ELECTRON, USE_SOCKET } from 'src/common/config';
import startSocketClient from '../services/startSocketClient';
import testElectronIpc from '../services/testElectronIpc';

const AppGuard: React.FC = () => {
  useEffect(() => {
    const cleans: (() => void)[] = [];
    if (USE_SOCKET) {
      const cleanSocket = startSocketClient();
      cleans.push(cleanSocket);
    }
    if (USE_ELECTRON) {
      testElectronIpc();
    }
    return () => {
      cleans.forEach((t) => t());
    };
  }, []);
  return (
    <>
      <Helmet>
        <title>{APP_NAME}</title>
      </Helmet>
      <Outlet />
    </>
  );
};

export default AppGuard;
