import { getProvider } from './provider-services';
import {
  joinUrl,
  viaProxy,
  isProxyableUrl,
  PROXY_BASE,
  PROXY_HEADERS,
} from './proxy';

export default class Network {
  constructor(statusPageUrl, refreshRateInSeconds, provider) {
    this.statusPageUrl = statusPageUrl;
    this.refreshRateInSeconds = refreshRateInSeconds;
    this.provider = provider;
    this.setIntervalIds = [];
    this.abortController = new AbortController();
  }

  clear = () => {
    this.setIntervalIds.forEach((timeoutId) => {
      clearInterval(timeoutId);
    });

    this.setIntervalIds = [];
    this.abortController.abort();
  };

  async _fetchAndPopulateData(url, callbackSetterFunction) {
    let networkResponse;

    try {
      const res = await fetch(url, {
        signal: this.abortController.signal,
        ...(url.startsWith(PROXY_BASE) ? { headers: PROXY_HEADERS } : {}),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      networkResponse = { data: await res.json() };
    } catch (err) {
      if (err.name === 'AbortError') return undefined;
      console.error(err);
      networkResponse =
        'There was an error while fetching data. Check your data provider or host URL.';
    }
    callbackSetterFunction(networkResponse);
    return networkResponse;
  }

  _pollData(url, callbackSetterFunction, callbackBeforePolling) {
    const setIntervalId = setInterval(async () => {
      callbackBeforePolling && callbackBeforePolling();
      await this._fetchAndPopulateData(url, callbackSetterFunction);
    }, this.refreshRateInSeconds * 1000);

    this.setIntervalIds.push(setIntervalId);
  }

  async pollSummaryData(callbackSetterFunction) {
    // Populate initial data before we start polling
    const url = this._getUrl('summaryUrl');

    await this._fetchAndPopulateData(url, callbackSetterFunction);
    this._pollData(url, callbackSetterFunction);
  }

  async pollCurrentIncidents(callbackSetterFunction, callbackBeforePolling) {
    const url = this._getUrl('incidentUrl');

    await this._fetchAndPopulateData(url, callbackSetterFunction);
    this._pollData(url, callbackSetterFunction, callbackBeforePolling);
  }

  checkIfTheSameDataSource() {
    const provider = getProvider(this.provider);
    return (
      Boolean(provider.summaryUrl) &&
      provider.summaryUrl === provider.incidentUrl
    );
  }

  // helper function to get correct url
  // pass either 'summaryUrl' or 'incidentUrl'
  _getUrl(providerUrlProperty) {
    const provider = getProvider(this.provider);
    let url;

    switch (provider.name) {
      case 'Status Io':
        // will replace "pages/history" with "1.0/status"
        url = `${this.statusPageUrl.replace(
          'pages/history',
          provider[providerUrlProperty]
        )}`;
        break;
      case 'AWS Health': {
        const target = joinUrl(
          this.statusPageUrl,
          provider[providerUrlProperty]
        );
        if (!isProxyableUrl(target)) {
          throw new Error('Disallowed AWS Health status URL');
        }
        url = viaProxy(target);
        break;
      }
      default:
        url = joinUrl(this.statusPageUrl, provider[providerUrlProperty]);
        break;
    }

    return url;
  }
}
