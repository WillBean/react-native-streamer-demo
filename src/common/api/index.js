import storage from '../storage';
import { BACK_END_API_SERVER_URL } from '../config';

export function fetchAsync(url, params) {
  return fetch(`${BACK_END_API_SERVER_URL}${url}`, {
    ...params,
  });
}

export function uploadUserAvatar(body) {
  return fetchAsync('/user/avatar', {
    body,
    method: 'POST',
  });
}
