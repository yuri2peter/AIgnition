import { ElectronHandler } from 'src/server/electron/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electronRenderer: ElectronHandler;
  }
}

export {};
