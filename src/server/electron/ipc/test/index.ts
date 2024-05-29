import { IpcHandles } from '../type';

const testHandles: IpcHandles = {
  async ping() {
    return 'pong';
  },
};
export default testHandles;
