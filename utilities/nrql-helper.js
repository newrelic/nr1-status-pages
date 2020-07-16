import { NrqlQuery } from 'nr1';

export default class NRQLHelper {
  constructor(query, refreshRateInSeconds, accountId) {
    this.refreshRateInSeconds = refreshRateInSeconds;
    this.query = query;
    this.setTimeoutId = undefined;
    this.accountId = accountId;
  }

  clear = () => {
    clearTimeout(this.setTimeoutId);
  };

  async _fetchAndPopulateData(callbackSetterFunction) {
    let networkResponse;

    try {
      networkResponse = await NrqlQuery.query({
        accountId: this.accountId,
        query: this.query,
        formatType: NrqlQuery.FORMAT_TYPE.RAW,
        pollInterval: this.refreshRateInSeconds
      });
    } catch (error) {
      networkResponse =
        'There was an error while fetching data. Check your data provider or host URL.';
    }
    callbackSetterFunction(networkResponse);
    return networkResponse;
  }

  _pollData(callbackSetterFunction, callbackBeforePolling) {
    this.setTimeoutId = setTimeout(async () => {
      callbackBeforePolling && callbackBeforePolling();

      try {
        this._fetchAndPopulateData(callbackSetterFunction);
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      } finally {
        this._pollData(callbackSetterFunction);
      }
    }, this.refreshRateInSeconds * 1000);
  }

  async pollSummaryData(callbackSetterFunction) {
    await this._fetchAndPopulateData(callbackSetterFunction);
    this._pollData(callbackSetterFunction);
  }

  async pollCurrentIncidents(callbackSetterFunction, callbackBeforePolling) {
    await this._fetchAndPopulateData(callbackSetterFunction);
    this._pollData(callbackSetterFunction, callbackBeforePolling);
  }
}
