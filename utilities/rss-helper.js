import Parser from 'rss-parser';

export default class RSSHelper {
  constructor(rssUrl, refreshRateInSeconds) {
    this.rssUrl = rssUrl;
    this.refreshRateInSeconds = refreshRateInSeconds;
    this.parser = new Parser();
    this.setIntervalId = undefined;
  }

  clear = () => {
    clearInterval(this.setIntervalId);
  };

  async _fetchAndPopulateData(callbackSetterFunction) {
    let networkResponse;

    try {
      networkResponse = await this.parser.parseURL(this.rssUrl);
    } catch {
      networkResponse =
        'There was an error while fetching data. Check your data provider or host URL.';
    }
    callbackSetterFunction({ data: networkResponse });
  }

  _pollData(callbackSetterFunction) {
    this.setIntervalId = setInterval(async () => {
      try {
        await this._fetchAndPopulateData(callbackSetterFunction);
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      }
    }, this.refreshRateInSeconds * 1000);
  }

  async pollCurrentIncidents(callbackSetterFunction) {
    await this._fetchAndPopulateData(callbackSetterFunction);
    this._pollData(callbackSetterFunction);
  }
}
