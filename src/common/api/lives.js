import { fetchAsync } from './index';
import { formatQuery } from '../util/tools';

export function fetchLiveList(query) {
  return fetchAsync(`/lives/list${formatQuery(query)}`, {
    method: 'GET',
  });
}

export function fetchLivePrepare(body) {
  return fetchAsync('/lives/prepare', {
    method: 'POST',
    body,
  });
}

export function fetchLivePlay(body) {
  return fetchAsync('/lives/play', {
    method: 'POST',
    body,
  });
}
