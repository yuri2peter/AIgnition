import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';

const electronHandler = {
  ipcRenderer: {
    invoke: (channel: string, data: unknown = null) => {
      return ipcRenderer.invoke(channel, data);
    },
    on: (channel: string, func: (...args: unknown[]) => void) => {
      const cb: (event: IpcRendererEvent, ...args: any[]) => void = (
        _event,
        ...args
      ) => func(...args);
      ipcRenderer.on(channel, cb);
      return () => ipcRenderer.removeListener(channel, cb);
    },
  },
};

contextBridge.exposeInMainWorld('electronRenderer', electronHandler);

export type ElectronHandler = typeof electronHandler;
