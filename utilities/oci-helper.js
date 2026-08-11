import { getProvider } from './provider-services';
import { joinUrl } from './proxy';
import { parseRSSFeed } from './rss-helper';

const PROVIDER_KEY = 'oci';

export default class OciHelper {
  constructor(hostname, refreshRateInSeconds) {
    const provider = getProvider(PROVIDER_KEY);
    this.statusUrl = joinUrl(hostname, provider.summaryUrl);
    this.incidentUrl = joinUrl(hostname, provider.incidentUrl);
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
      const { signal } = this.abortController;
      const [statusRes, incidentRes] = await Promise.all([
        fetch(this.statusUrl, { signal }),
        fetch(this.incidentUrl, { signal }),
      ]);
      if (!statusRes.ok) throw new Error(`HTTP ${statusRes.status}`);
      if (!incidentRes.ok) throw new Error(`HTTP ${incidentRes.status}`);

      const [status, incidentText] = await Promise.all([
        statusRes.json(),
        incidentRes.text(),
      ]);
      networkResponse.data = { status, feed: parseRSSFeed(incidentText) };
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('[OCI] fetch error', err);
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
