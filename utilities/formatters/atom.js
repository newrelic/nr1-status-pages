const FeedParser = require('feedparser');

export const atomFormatter = data => {
  const feedparser = new FeedParser();
  feedparser.write(data);

  return {
    name: feedparser.meta.title,
    description: feedparser.meta.description,
    indicator: 'UnKnown',
    link: feedparser.meta.link
  };
};

export const atomIncidentFormatter = data => {
  const feedparser = new FeedParser();
  feedparser.write(data);
  const incidents = [];
  let item;
  while ((item = feedparser.read())) {
    incidents.push({
      name: item.title,
      created_at: item.date,
      impact: 'unknown',
      incident_updates: [
        {
          created_at: item.date,
          body: `Link: ${item.link}`
        },
        {
          created_at: item.date,
          body: `Description: ${item.description}`
        }
      ]
    });
  }

  return incidents;
};
