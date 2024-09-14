import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { get } from 'lodash';
import { AUTH_TOKEN_NAME } from 'src/common/config';
import { EventSourceMessage, fetchEventSource } from './fetchEventSource';

export function api() {
  return axios.create({
    headers: {
      Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_NAME)}`,
    },
  });
}

export function eventApi(
  url: string,
  body: any,
  onmessage: (ev: EventSourceMessage) => void,
  signal?: AbortSignal
) {
  return fetchEventSource(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_NAME)}`,
    },
    body: JSON.stringify(body),
    onmessage,
    onerror: console.error,
    signal,
  });
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
