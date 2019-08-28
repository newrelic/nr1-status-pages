const axios = require('axios');

export default class StatusPageNetwork {

    constructor(statusPageUrl, refreshRateInSeconds) {
        this.statusPageUrl = statusPageUrl;
        this.refreshRateInSeconds = refreshRateInSeconds;
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
            } catch(err) {
                console.error(err);
            } finally {
                this._pollData(url, callbackSetterFunction)
            }
        }, this.refreshRateInSeconds * 1000);
    }

    async pollSummaryData(callbackSetterFunction) {
        // Populate initial data before we start polling
        const url = `${this.statusPageUrl}/api/v2/summary.json`;
        await this._fetchAndPopulateData(url, callbackSetterFunction);
        this._pollData(url, callbackSetterFunction)
    }

    async pollCurrentIncidents(callbackSetterFunction) {
        // Populate initial data before we start polling
        // const url = `${this.statusPageUrl}/api/v2/incidents/unresolved.json`;
        const url = `${this.statusPageUrl}/api/v2/incidents.json`;
        await this._fetchAndPopulateData(url, callbackSetterFunction);
        this._pollData(url, callbackSetterFunction)
    }

    async pollMaintenances(callbackSetterFunction) {
        const url = `${this.statusPageUrl}/api/v2/scheduled-maintenances/active.json`;
        await this._fetchAndPopulateData(url, callbackSetterFunction);
        this._pollData(url, callbackSetterFunction)
    }

    async pollGoogleCloud(callbackSetterFunction) {
        const url = 'https://status.cloud.google.com/incidents.json';
        await this._fetchAndPopulateData(url, callbackSetterFunction);
        this._pollData(url, callbackSetterFunction)
    }

}