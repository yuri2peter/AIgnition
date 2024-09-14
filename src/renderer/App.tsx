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
import 'react-complex-tree/lib/style-modern.css';
import 'react-medium-image-zoom/dist/styles.css';
import './styles/main.css';
import './styles/prism-highlight.css';
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
import ChangePageIdModal from './components/modals/ChangePageIdModal';
import { ImportFromJotwayModal } from './pages/page-view/C2/panels/Data/ImportFromJotway';
import { ImportFromBrowserFavoritesModal } from './pages/page-view/C2/panels/Data/ImportFromBrowserFavorites';
import { ImportFromArchiveModal } from './pages/page-view/C2/panels/Data/ImportFromArchive';

declare module '@mantine/modals' {
  // @ts-ignore
  export interface MantineModalsOverride {
    modals: typeof modals;
  }
}
const modals = {
  ChangePageIdModal,
  ImportFromJotwayModal,
  ImportFromBrowserFavoritesModal,
  ImportFromArchiveModal,
};

IS_DEV && USE_CHII && enableChii();

export default function App() {
  return (
    <React.StrictMode>
      <MantineProvider forceColorScheme={'light'}>
        <ThemeProvider>
          <ContextMenuProvider>
            <ModalsProvider modals={modals}>
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
