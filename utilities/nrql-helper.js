import { NrqlQuery } from 'nr1';

export default class NRQLHelper {
  constructor(query, refreshRateInSeconds, accountId) {
    this.refreshRateInSeconds = refreshRateInSeconds;
    this.query = query;
    this.accountId = accountId;
    this.setIntervalIds = [];
    this.isPolling = false;
  }

  clear = () => {
    this.setIntervalIds.forEach((id) => clearInterval(id));
    this.setIntervalIds = [];
    this.isPolling = false;
  };

  async _fetchAndPopulateData(callbackSetterFunction) {
    let networkResponse;

    try {
      networkResponse = await NrqlQuery.query({
        accountIds: [this.accountId],
        query: this.query,
        formatType: NrqlQuery.FORMAT_TYPE.RAW,
      });

      if (networkResponse.data?.metadata?.messages?.[0]) {
        networkResponse = networkResponse.data.metadata.messages[0];
      }
    } catch (err) {
      console.error(err);
      networkResponse =
        'There was an error while fetching data. Check your data provider or host URL.';
    }
    callbackSetterFunction(networkResponse);
    return networkResponse;
  }

  _pollData(callbackSetterFunction, callbackBeforePolling) {
    if (this.isPolling) return;
    this.isPolling = true;

    const setIntervalId = setInterval(async () => {
      callbackBeforePolling && callbackBeforePolling();
      await this._fetchAndPopulateData(callbackSetterFunction);
    }, this.refreshRateInSeconds * 1000);

    this.setIntervalIds.push(setIntervalId);
  }

  async pollCurrentIncidents(callbackSetterFunction, callbackBeforePolling) {
    await this._fetchAndPopulateData(callbackSetterFunction);
    this._pollData(callbackSetterFunction, callbackBeforePolling);
  }
}
