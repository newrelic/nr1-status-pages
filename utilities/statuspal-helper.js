import { getProvider } from './provider-services';

const axios = require('axios');

const STATUSPAL_API = getProvider('statusPal').apiURL;

export default class StatuspalHelper {
  constructor(subDomain) {
    this.subDomain = subDomain;
    this.refreshRateInSeconds = 30; // Set to 30 seconds to be under the request limit of cors-anywhere
    // the StatusPal API may change in the feature
    this.setIntervalIds = [];
  }

  clear = () => {
    this.setIntervalIds.forEach((timeoutId) => {
      clearInterval(timeoutId);
    });

    this.setIntervalIds = [];
  };

  async _fetchAndPopulateData(urls, callbackSetterFunction) {
    let networkResponse;

    try {
      const data = await Promise.all(
        urls.map(async (url) => {
          const res = await axios.get(STATUSPAL_API + url);

          return { data: res.data, url };
        })
      );

      networkResponse = {
        data: Object.fromEntries(data.map((data) => [data.url, data.data])),
      };
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
    const urls = [`/status_pages/${this.subDomain}/status`];

    await this._fetchAndPopulateData(urls, callbackSetterFunction);
    this._pollData(urls, callbackSetterFunction);
  }

  async pollCurrentIncidents(callbackSetterFunction, callbackBeforePolling) {
    const urls = [
      `/status_pages/${this.subDomain}/status`,
      `/status_pages/${this.subDomain}/incidents`,
    ];

    await this._fetchAndPopulateData(urls, callbackSetterFunction);
    this._pollData(urls, callbackSetterFunction, callbackBeforePolling);
  }
}
