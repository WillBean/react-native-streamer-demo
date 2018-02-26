import { fetchAsync } from './index';

export function fetchUserUploadAvatar(body) {
  return fetchAsync('/users/avatar', {
    body,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function fetchUserUpdateDesc(body) {
  return fetchAsync('/users/updateDesc', {
    body: JSON.stringify(body),
    method: 'POST',
  });
}

export function fetchUserRegister(body) {
  return fetchAsync('/users/register', {
    body: JSON.stringify(body),
    method: 'POST',
  });
}

export function fecthUserLogin(body) {
  return fetchAsync('/users/login', {
    body: JSON.stringify(body),
    method: 'POST',
  });
}

export function fecthUserQuery(body) {
  return fetchAsync('/users/query', {
    body,
    method: 'POST',
  });
}
