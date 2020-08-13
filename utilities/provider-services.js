import { googleIncidentFormatter, googleFormatter } from './formatters/google';
import {
  statusPageIncidentFormatter,
  statusPageIoFormatter
} from './formatters/status-page-io';
import {
  statusIoIncidentFormatter,
  statusIoFormatter
} from './formatters/status-io';
import { nrqlFormatter, nrqlIncidentFormatter } from './formatters/nrql';
import { rssFormatter, rssIncidentFormatter } from './formatters/rss';
import { statusPalFormatter, statusPalIncidentFormatter } from './formatters/status-pal';

const providers = {
  google: {
    summaryUrl: '/incidents.json',
    incidentUrl: '/incidents.json',
    impactMap: {
      low: 'minor',
      medium: 'major',
      high: 'critical'
    },
    name: 'Google Cloud',
    incidentFormatter: googleIncidentFormatter,
    summaryFormatter: googleFormatter
  },
  statusPageIo: {
    summaryUrl: '/api/v2/summary.json',
    incidentUrl: '/api/v2/incidents.json',
    impactMap: {
      minor: 'minor',
      major: 'major',
      critical: 'critical'
    },
    name: 'Status Page',
    summaryFormatter: statusPageIoFormatter,
    incidentFormatter: statusPageIncidentFormatter
  },
  statusIo: {
    // assumes format entered of https://hostname/pages/history/<identifier>
    // will replace "pages/history" with "1.0/status"
    summaryUrl: '1.0/status',
    incidentUrl: '1.0/status',
    impactMap: {
      minor: 'minor',
      major: 'major',
      critical: 'critical'
    },
    name: 'Status Io',
    summaryFormatter: statusIoFormatter,
    incidentFormatter: statusIoIncidentFormatter
  },
  nrql: {
    impactMap: {
      warning: 'minor',
      major: 'major',
      critical: 'critical'
    },
    name: 'NRQL',
    summaryFormatter: nrqlFormatter,
    incidentFormatter: nrqlIncidentFormatter
  },
  rss: {
    impactMap: {
      warning: 'minor',
      major: 'major',
      critical: 'critical'
    },
    name: 'RSS Feed',
    summaryFormatter: rssFormatter,
    incidentFormatter: rssIncidentFormatter
  },
  statusPal: {
    impactMap: {
      minor: 'minor',
      major: 'major',
      maintence: 'maintence'
    },
    apiURL: 'https://cors-anywhere.herokuapp.com/statuspal.io/api/v1',
    name: 'Statuspal',
    summaryFormatter: statusPalFormatter,
    incidentFormatter: statusPalIncidentFormatter
  }
};

export const getProvider = providerKey => {
  if (providerKey === 'Status Page') {
    providerKey = 'statusPageIo';
  } else if (providerKey === 'Status Io') {
    providerKey = 'statusIo';
  } else if (providerKey === 'nrql') {
    providerKey = 'nrql';
  } else if (providerKey === 'rss') {
    providerKey = 'rss';
  } else if (providerKey === 'Statuspal') {
    providerKey = 'statusPal';
  }
  return providers[providerKey];
};
