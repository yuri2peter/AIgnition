import { notifications } from '@mantine/notifications';
import axios from 'axios';

const instance = axios.create({});

export function api() {
  return instance;
}

export function apiErrorHandler(error: any) {
  console.error(error);
  notifications.show({
    color: 'red',
    title: 'Api Error',
    message: error?.message || 'Api Error Occurred',
  });
}
