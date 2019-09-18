import { getProvider } from './provider-services';

const axios = require('axios');

export default class Network {
  constructor(statusPageUrl, refreshRateInSeconds, provider) {
    this.statusPageUrl = statusPageUrl;
    this.refreshRateInSeconds = refreshRateInSeconds;
    this.provider = provider;
  }

  async _fetchAndPopulateData(url, callbackSetterFunction) {
    const networkResponse = await axios.get(url);
    callbackSetterFunction(networkResponse);
    return networkResponse;
  }

  _pollData(url, callbackSetterFunction) {
    setTimeout(async () => {
      try {
        this._fetchAndPopulateData(url, callbackSetterFunction);
      } catch (err) {
        console.error(err);
      } finally {
        this._pollData(url, callbackSetterFunction);
      }
    }, this.refreshRateInSeconds * 1000);
  }

  async pollSummaryData(callbackSetterFunction) {
    // Populate initial data before we start polling
    const url = `${this.statusPageUrl}${getProvider(this.provider).summaryUrl}`;
    await this._fetchAndPopulateData(url, callbackSetterFunction);
    this._pollData(url, callbackSetterFunction);
  }

  async pollCurrentIncidents(callbackSetterFunction) {
    const url = `${this.statusPageUrl}${
      getProvider(this.provider).incidentUrl
    }`;
    await this._fetchAndPopulateData(url, callbackSetterFunction);
    this._pollData(url, callbackSetterFunction);
  }
}
