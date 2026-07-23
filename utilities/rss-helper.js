import axios from 'axios';

export default class RSSHelper {
  constructor(rssUrl, refreshRateInSeconds) {
    this.rssUrl = rssUrl;
    this.refreshRateInSeconds = refreshRateInSeconds;
    this.setIntervalId = undefined;
  }

  clear = () => {
    clearInterval(this.setIntervalId);
  };

  _parseRSS(xmlText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');
    const isAtom = !!doc.querySelector('feed');

    const getText = (el, selector) =>
      el.querySelector(selector)?.textContent?.trim() || '';
    const stripTags = (html) => html.replace(/<[^>]*>/g, '').trim();

    const feedTitle = getText(doc, isAtom ? 'feed > title' : 'channel > title');
    const feedLink = isAtom
      ? (
          doc.querySelector('feed > link[rel="alternate"]') ||
          doc.querySelector('feed > link:not([rel])')
        )?.getAttribute('href') || ''
      : getText(doc, 'channel > link');

    const items = Array.from(
      doc.querySelectorAll(isAtom ? 'entry' : 'item')
    ).map((item) => {
      const title = getText(item, 'title');
      const link = isAtom
        ? (
            item.querySelector('link[rel="alternate"]') ||
            item.querySelector('link:not([rel])')
          )?.getAttribute('href') || getText(item, 'link')
        : getText(item, 'link');
      const rawDate = isAtom
        ? getText(item, 'published') || getText(item, 'updated')
        : getText(item, 'pubDate');
      const isoDate = rawDate ? new Date(rawDate).toISOString() : '';
      const rawContent = isAtom
        ? getText(item, 'content') || getText(item, 'summary')
        : getText(item, 'description');
      const contentSnippet = stripTags(rawContent);

      return { title, link, isoDate, contentSnippet };
    });

    return { title: feedTitle, link: feedLink, items };
  }

  async _fetchAndPopulateData(callbackSetterFunction) {
    let networkResponse = {};

    try {
      const response = await axios.get(this.rssUrl);
      networkResponse.data = this._parseRSS(response.data);
    } catch {
      networkResponse =
        'There was an error while fetching data. Check your data provider or host URL.';
    }
    callbackSetterFunction(networkResponse);
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
