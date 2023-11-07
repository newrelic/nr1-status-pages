import { getProvider } from './provider-services';

import axios from 'axios';

export default class Network {
  constructor(statusPageUrl, refreshRateInSeconds, provider) {
    this.statusPageUrl = statusPageUrl;
    this.refreshRateInSeconds = refreshRateInSeconds;
    this.provider = provider;
    this.setIntervalIds = [];
  }

  clear = () => {
    this.setIntervalIds.forEach((timeoutId) => {
      clearInterval(timeoutId);
    });

    this.setIntervalIds = [];
  };

  async _fetchAndPopulateData(url, callbackSetterFunction) {
    let networkResponse;

    try {
      networkResponse = await axios.get(url);
    } catch {
      networkResponse =
        'There was an error while fetching data. Check your data provider or host URL.';
    }
    callbackSetterFunction(networkResponse);
    return networkResponse;
  }

  _pollData(url, callbackSetterFunction, callbackBeforePolling) {
    const setIntervalId = setInterval(async () => {
      callbackBeforePolling && callbackBeforePolling();

      try {
        this._fetchAndPopulateData(url, callbackSetterFunction);
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      }
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
    return provider.summaryUrl === provider.incidentUrl;
  }

  // helper function to get correct url
  // pass either 'summaryUrl' or 'incidentUrl'
  _getUrl(providerUrlProperty) {
    const provider = getProvider(this.provider);
    let url = '';

    switch (provider.name) {
      case 'Status Io':
        // will replace "pages/history" with "1.0/status"
        url = `${this.statusPageUrl.replace(
          'pages/history',
          provider[providerUrlProperty]
        )}`;
        break;
      default:
        url = `${this.statusPageUrl}${provider[providerUrlProperty]}`;
        break;
    }

    // console.debug(url);

    return url;
  }
}
