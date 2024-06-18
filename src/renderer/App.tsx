import './App.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/code-highlight/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/nprogress/styles.css';
import '@fontsource/inter/100.css';
import '@fontsource/inter/200.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import 'mantine-contextmenu/styles.css';
import React from 'react';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NavigationProgress } from '@mantine/nprogress';
import { Notifications } from '@mantine/notifications';
import { ContextMenuProvider } from 'mantine-contextmenu';

import 'src/common/prepareLibs';
import AppRoutes from './routes';
import enableChii from './helpers/enableChii';
import { IS_DEV, USE_CHII } from 'src/common/config';
import ThemeProvider from './ThemeProvider';
import SettingsModal from './components/modals/SettingsModal';

IS_DEV && USE_CHII && enableChii();

export default function App() {
  return (
    <React.StrictMode>
      <MantineProvider forceColorScheme={'light'}>
        <ThemeProvider>
          <ContextMenuProvider>
            <ModalsProvider modals={{ SettingsModal }}>
              <NavigationProgress />
              <Notifications position="top-center" />
              <AppRoutes />
            </ModalsProvider>
          </ContextMenuProvider>
        </ThemeProvider>
      </MantineProvider>
    </React.StrictMode>
  );
}
