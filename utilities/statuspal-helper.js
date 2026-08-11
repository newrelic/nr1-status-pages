import { getProvider } from './provider-services';

export default class StatuspalHelper {
  constructor(subDomain, refreshRateInSeconds) {
    this.subDomain = subDomain;
    this.refreshRateInSeconds = refreshRateInSeconds;
    this.apiURL = getProvider('statusPal').apiURL;
    this.setIntervalIds = [];
    this.isPolling = false;
    this.abortController = new AbortController();
  }

  clear = () => {
    this.setIntervalIds.forEach((timeoutId) => {
      clearInterval(timeoutId);
    });

    this.setIntervalIds = [];
    this.isPolling = false;
    this.abortController.abort();
  };

  async _fetchAndPopulateData(callbackSetterFunction) {
    let networkResponse;

    try {
      const { signal } = this.abortController;
      const encodedSubDomain = encodeURIComponent(this.subDomain);
      const [statusResult, incidentsResult] = await Promise.allSettled(
        [
          `/status_pages/${encodedSubDomain}/status`,
          `/status_pages/${encodedSubDomain}/incidents`,
        ].map(async (url) => {
          const res = await fetch(this.apiURL + url, { signal });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
      );

      if (statusResult.status === 'rejected') {
        throw statusResult.reason;
      }

      const statusRes = statusResult.value;
      const incidentsRes =
        incidentsResult.status === 'fulfilled' ? incidentsResult.value : {};

      networkResponse = {
        data: {
          status_page: {
            ...statusRes.status_page,
            ...incidentsRes.status_page,
          },
          incidents: incidentsRes.incidents || statusRes.incidents || [],
        },
      };
    } catch (err) {
      if (err.name === 'AbortError') return undefined;
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
