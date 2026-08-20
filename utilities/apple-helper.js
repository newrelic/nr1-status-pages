import { viaProxy, PROXY_HEADERS } from './proxy';

const ALLOWED_HOSTNAME = 'www.apple.com';
const ALLOWED_PATH_PREFIX = '/support/systemstatus/data/';

export const isAllowedAppleUrl = (rawUrl) => {
  try {
    const parsed = new URL(rawUrl);
    return (
      parsed.protocol === 'https:' &&
      parsed.hostname === ALLOWED_HOSTNAME &&
      parsed.pathname.startsWith(ALLOWED_PATH_PREFIX)
    );
  } catch {
    return false;
  }
};

const proxyFetch = async (url, signal) => {
  if (!isAllowedAppleUrl(url)) {
    throw new Error('Disallowed Apple status URL');
  }
  const res = await fetch(viaProxy(url), { signal, headers: PROXY_HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  // Apple returns JSONP: jsonCallback({...}) — strip the wrapper
  const json = text.replace(/^[^(]+\(/, '').replace(/\)\s*;?\s*$/, '');
  return JSON.parse(json);
};

export default class AppleHelper {
  constructor(url, refreshRateInSeconds) {
    this.url = url;
    this.refreshRateInSeconds = refreshRateInSeconds;
    this.setIntervalIds = [];
    this.isPolling = false;
    this.abortController = new AbortController();
  }

  clear = () => {
    this.setIntervalIds.forEach((id) => clearInterval(id));
    this.setIntervalIds = [];
    this.isPolling = false;
    this.abortController.abort();
  };

  async _fetchAndPopulateData(callbackSetterFunction) {
    let networkResponse = {};

    try {
      networkResponse.data = await proxyFetch(
        this.url,
        this.abortController.signal
      );

      console.log('[Apple] fetched data', networkResponse.data);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('[Apple] fetch error', err);
      networkResponse =
        'There was an error while fetching data. Check your data provider or host URL.';
    }
    callbackSetterFunction(networkResponse);
  }

  _pollData(callbackSetterFunction) {
    if (this.isPolling) return;
    this.isPolling = true;

    const setIntervalId = setInterval(async () => {
      await this._fetchAndPopulateData(callbackSetterFunction);
    }, this.refreshRateInSeconds * 1000);

    this.setIntervalIds.push(setIntervalId);
  }

  async pollCurrentIncidents(callbackSetterFunction) {
    await this._fetchAndPopulateData(callbackSetterFunction);
    this._pollData(callbackSetterFunction);
  }
}
