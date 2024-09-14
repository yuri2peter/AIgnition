import { notifications } from '@mantine/notifications';
import { createZustandStore } from 'src/common/libs/createZustand';
import { api, apiErrorHandler } from '../helpers/api';
import { useMainLayoutStore } from './useMainLayoutStore';
import { useLeftsideStore } from './useLeftsideStore';
import { AUTH_TOKEN_NAME } from 'src/common/config';

interface Store {
  loggedIn: boolean;
  isNewInstance: boolean;
}

const defaultStore: Store = {
  loggedIn: false,
  isNewInstance: false,
};

export const useUserStore = createZustandStore(defaultStore, (set) => {
  const setLoggedIn = (loggedIn: boolean) => {
    set({
      loggedIn,
    });
  };
  const setIsNewInstance = (isNewInstance: boolean) => {
    set({
      isNewInstance,
    });
  };
  return {
    actions: { setLoggedIn, setIsNewInstance },
  };
});

export async function loginWithPasswordHashed(passwordHashed: string) {
  try {
    const {
      data: { token },
    } = await api().post('/api/auth/login-password', {
      passwordHashed,
    });
    notifications.show({
      message: 'Welcome back!',
      color: 'green',
    });
    const { setLoggedIn } = useUserStore.getState().actions;
    localStorage.setItem(AUTH_TOKEN_NAME, token);
    setLoggedIn(true);
  } catch (error) {
    return apiErrorHandler(error);
  }
}

export async function requestTempPassword() {
  try {
    await api().post('/api/auth/request-temp-password');
    notifications.show({
      title: 'Action performed',
      message: 'The temporary password has been generated.',
      color: 'green',
    });
  } catch (error) {
    return apiErrorHandler(error);
  }
}

export async function updatePassword(passwordHashed: string) {
  try {
    await api().post('/api/auth/update-password', {
      passwordHashed,
    });
    notifications.show({
      title: 'Action performed',
      message: 'Other devices will need to login again.',
      color: 'green',
      autoClose: 5000,
    });
    const { setIsNewInstance } = useUserStore.getState().actions;
    setIsNewInstance(false);
  } catch (error) {
    return apiErrorHandler(error);
  }
}

export async function logout() {
  try {
    await api().post('/api/auth/logout');
    const { setLoggedIn } = useUserStore.getState().actions;
    localStorage.removeItem(AUTH_TOKEN_NAME);
    setLoggedIn(false);
  } catch (error) {
    return apiErrorHandler(error);
  }
}

export async function logoutOtherDevices() {
  try {
    await api().post('/api/auth/logout-other-devices');
    notifications.show({
      title: 'Action performed',
      message: 'Other devices will need to login again.',
      color: 'green',
      autoClose: 5000,
    });
  } catch (error) {
    return apiErrorHandler(error);
  }
}

export async function tryRenewTokenIfLoggedIn() {
  try {
    const {
      data: { isNewInstance, token },
    } = await api().post('/api/auth/token-renew');
    const { setLoggedIn, setIsNewInstance } = useUserStore.getState().actions;
    const { setShowLeft } = useMainLayoutStore.getState().actions;
    const { setActivedSectionId } = useLeftsideStore.getState().actions;
    localStorage.setItem(AUTH_TOKEN_NAME, token);
    setLoggedIn(true);
    setIsNewInstance(isNewInstance);
    if (isNewInstance) {
      setActivedSectionId('user');
      setShowLeft(true);
    }
    return true;
  } catch (error) {
    useUserStore.getState().actions.setLoggedIn(false);
    return false;
  }
}
