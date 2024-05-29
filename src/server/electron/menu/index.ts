import { BrowserWindow, Menu, dialog } from 'electron';
import { IS_DEV, IS_MAC } from 'src/common/config';

const commandKey = IS_MAC ? 'Command' : 'Ctrl';

export default function buildMenu(win: BrowserWindow) {
  if (IS_DEV) {
    // 检查元素
    win.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;
      Menu.buildFromTemplate([
        {
          label: '检查元素',
          click: () => {
            win.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: win });
    });
  }

  // 主菜单
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: '应用',
        submenu: [
          {
            label: '关闭',
            accelerator: `${commandKey}+W`,
            click: () => {
              win.close();
            },
          },
        ],
      },
      {
        label: '视图',
        submenu: [
          {
            label: '重载',
            accelerator: `${commandKey}+R`,
            click: () => {
              win.webContents.reload();
            },
          },
          {
            label: '切换全屏',
            accelerator: 'F11',
            click: () => {
              win.setFullScreen(!win.isFullScreen());
            },
          },
          {
            label: '开发者工具',
            accelerator: 'F12',
            click: () => {
              win.webContents.toggleDevTools();
            },
          },
        ],
      },
      {
        label: '帮助',
        submenu: [
          {
            label: '关于',
            click() {
              dialog.showMessageBox({
                title: '关于',
                message: 'Version: v0.0.1',
              });
            },
          },
        ],
      },
    ])
  );
}
