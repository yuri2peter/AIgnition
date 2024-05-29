import { merge } from 'lodash';
import { ipcMain } from 'electron';
import { IpcHandles } from './type';
import testHandles from './test';

const handles: IpcHandles = merge({}, testHandles);

export default function handleMainIpc() {
  Object.keys(handles).forEach((key) => {
    const handle = handles[key];
    ipcMain.handle(key, (_e, data) => {
      return handle(data);
    });
  });
}
