import { fetchAsync } from './index';
import { formatQuery } from '../util/tools';

export function fetchLiveList(query) {
  return fetchAsync(`/lives/list${formatQuery(query)}`, {
    method: 'GET',
  });
}

export function fetchLivePrepare(body) {
  console.log(body);
  return fetchAsync('/lives/prepare', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function fetchLivePlay(body) {
  return fetchAsync('/lives/play', {
    method: 'POST',
    body,
  });
}

export function fetchLiveStop(body) {
  return fetchAsync('/lives/stop', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function fetchLiveStatus(query) {
  return fetchAsync(`/lives/stop${formatQuery(query)}`, {
    method: 'GET',
  });
}
