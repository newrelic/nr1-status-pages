import { NrqlQuery } from 'nr1';

export default class WorkloadHelper {
  constructor(workloadGuid, refreshRateInSeconds, accountId) {
    this.refreshRateInSeconds = refreshRateInSeconds;
    this.query = `SELECT EventTimeStamp, EventName, EventStatus, Workload FROM (SELECT earliest(timestamp) AS EventTimeStamp, latest(timestamp) AS EventTimeStamp, latest(statusValue) AS EventName, latest(entity.name) AS Workload FROM WorkloadStatus WHERE workloadGuid = '${workloadGuid}' FACET statusValueCode AS EventStatus, dateOf(timestamp) LIMIT 100) ORDER BY EventTimeStamp DESC SINCE 2 WEEKS AGO LIMIT 100`;
    this.setTimeoutId = undefined;
    this.accountId = accountId;
    this.workloadGuid = workloadGuid;
  }

  clear = () => {
    clearTimeout(this.setTimeoutId);
  };

  async _fetchAndPopulateData(callbackSetterFunction) {
    let networkResponse;

    try {
      networkResponse = await NrqlQuery.query({
        accountIds: [this.accountId],
        query: this.query,
        formatType: NrqlQuery.FORMAT_TYPE.RAW,
        pollInterval: this.refreshRateInSeconds * 1000
      });

      if (networkResponse.data.metadata.messages[0]) {
        networkResponse = networkResponse.data.metadata.messages[0];
      }
      networkResponse.data.workloadGuid = this.workloadGuid;
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
