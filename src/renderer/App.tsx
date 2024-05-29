import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/code-highlight/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/nprogress/styles.css';
import './App.css';
import React from 'react';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NavigationProgress } from '@mantine/nprogress';
import { Notifications } from '@mantine/notifications';

import 'src/common/prepareLibs';
import AppRoutes from './routes';
import enableChii from './helpers/enableChii';
import { IS_DEV, USE_CHII } from 'src/common/config';
import ThemeProvider from './ThemeProvider';
import { selectColorSchema, useColorSchema } from './store/useColorSchema';

IS_DEV && USE_CHII && enableChii();

export default function App() {
  const colorScheme = useColorSchema(selectColorSchema);
  return (
    <React.StrictMode>
      <MantineProvider forceColorScheme={colorScheme}>
        <ThemeProvider>
          <ModalsProvider modals={{}}>
            <NavigationProgress />
            <Notifications />
            <AppRoutes />
          </ModalsProvider>
        </ThemeProvider>
      </MantineProvider>
    </React.StrictMode>
  );
}
