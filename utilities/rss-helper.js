import { PROXY_BASE, viaProxy, isProxyableUrl, PROXY_HEADERS } from './proxy';

// Reused across every parse call — DOMParser carries no state between calls,
// so a single instance avoids allocating a fresh parser per feed item.
const sharedParser = new DOMParser();

const getText = (el, selector) =>
  el.querySelector(selector)?.textContent?.trim() || '';

const findAtomLink = (el, prefix = '') =>
  (
    el.querySelector(`${prefix}link[rel="alternate"]`) ||
    el.querySelector(`${prefix}link:not([rel])`)
  )?.getAttribute('href') || '';

const stripTags = (html) => {
  const parsed = sharedParser.parseFromString(html || '', 'text/html');
  return parsed.body?.textContent?.trim() || '';
};

const toIsoDateOrEmpty = (rawDate) => {
  if (!rawDate) return '';
  const date = new Date(rawDate);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
};

// Standalone so non-proxy-gated callers (e.g. oci-helper.js) can reuse the
// same RSS/Atom parsing without going through RSSHelper's fetch/proxy logic.
export const parseRSSFeed = (xmlText) => {
  const doc = sharedParser.parseFromString(xmlText, 'application/xml');
  const isAtom = !!doc.querySelector('feed');

  const feedTitle = getText(doc, isAtom ? 'feed > title' : 'channel > title');
  const feedDescription = getText(
    doc,
    isAtom ? 'feed > subtitle' : 'channel > description'
  );
  const feedLink = isAtom
    ? findAtomLink(doc, 'feed > ')
    : getText(doc, 'channel > link');

  const items = Array.from(doc.querySelectorAll(isAtom ? 'entry' : 'item')).map(
    (item) => {
      const title = getText(item, 'title');
      const link = isAtom
        ? findAtomLink(item) || getText(item, 'link')
        : getText(item, 'link');
      const rawDate = isAtom
        ? getText(item, 'published') || getText(item, 'updated')
        : getText(item, 'pubDate');
      const isoDate = toIsoDateOrEmpty(rawDate);
      const rawContent = isAtom
        ? getText(item, 'content') || getText(item, 'summary')
        : getText(item, 'description');
      const contentSnippet = stripTags(rawContent);

      return { title, link, isoDate, contentSnippet };
    }
  );

  return {
    title: feedTitle,
    description: feedDescription,
    link: feedLink,
    items,
  };
};

export default class RSSHelper {
  constructor(rssUrl, refreshRateInSeconds) {
    this.rssUrl = rssUrl;
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
      if (!this.rssUrl.startsWith(PROXY_BASE) && !isProxyableUrl(this.rssUrl)) {
        throw new Error('Disallowed RSS feed URL');
      }
      const fetchUrl = this.rssUrl.startsWith(PROXY_BASE)
        ? this.rssUrl
        : viaProxy(this.rssUrl);
      const res = await fetch(fetchUrl, {
        signal: this.abortController.signal,
        headers: PROXY_HEADERS,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      networkResponse.data = parseRSSFeed(await res.text());
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error(err);
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
