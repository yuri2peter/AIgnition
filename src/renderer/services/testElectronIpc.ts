export default function testElectronIpc() {
  window.electronRenderer?.ipcRenderer.invoke('ping').then((rel) => {
    console.log('Message from ipc main:', rel);
  });
}
