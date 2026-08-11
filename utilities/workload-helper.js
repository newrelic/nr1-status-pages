import { NrqlQuery } from 'nr1';

// New Relic entity GUIDs are base64url-shaped; reject anything else before it
// reaches string interpolation into the NRQL query below.
const WORKLOAD_GUID_PATTERN = /^[A-Za-z0-9+/=_-]+$/;

export default class WorkloadHelper {
  constructor(workloadGuid, refreshRateInSeconds, accountId) {
    if (!WORKLOAD_GUID_PATTERN.test(workloadGuid || '')) {
      throw new Error('Invalid workload GUID');
    }
    this.refreshRateInSeconds = refreshRateInSeconds;
    this.query = `SELECT EventTimeStamp, EventName, EventStatus, Workload FROM (SELECT earliest(timestamp) AS EventTimeStamp, latest(timestamp) AS EventTimeStamp, latest(statusValue) AS EventName, latest(entity.name) AS Workload FROM WorkloadStatus WHERE workloadGuid = '${workloadGuid}' FACET statusValueCode AS EventStatus, dateOf(timestamp) LIMIT 100) ORDER BY EventTimeStamp DESC SINCE 2 WEEKS AGO LIMIT 100`;
    this.accountId = accountId;
    this.workloadGuid = workloadGuid;
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
      if (networkResponse.data) {
        networkResponse.data.workloadGuid = this.workloadGuid;
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
