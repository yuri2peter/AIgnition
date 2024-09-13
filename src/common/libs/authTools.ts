import md5 from 'md5';
import { APP_NAME } from '../config';

export function passwordHasher(password: string) {
  return md5(password + APP_NAME);
}
