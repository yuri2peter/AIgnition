import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { get } from 'lodash';

const instance = axios.create({});

export function api() {
  return instance;
}

export function apiErrorHandler(error: any) {
  console.error(error);
  notifications.show({
    color: 'red',
    title: 'Request Error',
    message:
      get(error, 'response.data.error') ||
      error?.message ||
      'Api Error Occurred',
  });
}
