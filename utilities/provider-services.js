import { googleIncidentFormatter, googleFormatter } from './formatters/google';
import {
  statusPageIncidentFormatter,
  statusPageIoFormatter,
} from './formatters/status-page-io';
import {
  statusIoIncidentFormatter,
  statusIoFormatter,
} from './formatters/status-io';

const providers = {
  google: {
    summaryUrl: '/incidents.json',
    incidentUrl: '/incidents.json',
    impactMap: {
      low: 'minor',
      medium: 'major',
      high: 'critical',
    },
    name: 'Google Cloud',
    incidentFormatter: googleIncidentFormatter,
    summaryFormatter: googleFormatter,
  },
  statusPageIo: {
    summaryUrl: '/api/v2/summary.json',
    incidentUrl: '/api/v2/incidents.json',
    impactMap: {
      minor: 'minor',
      major: 'major',
      critical: 'critical',
    },
    name: 'Status Page',
    summaryFormatter: statusPageIoFormatter,
    incidentFormatter: statusPageIncidentFormatter,
  },
  statusIo: {
    // assumes format entered of https://hostname/pages/history/<identifier>
    // will replace "pages/history" with "1.0/status"
    summaryUrl: '1.0/status',
    incidentUrl: '1.0/status',
    impactMap: {
      minor: 'minor',
      major: 'major',
      critical: 'critical',
    },
    name: 'Status Io',
    summaryFormatter: statusIoFormatter,
    incidentFormatter: statusIoIncidentFormatter,
  },
};

export const getProvider = providerKey => {
  providerKey =
    providerKey === 'Status Page'
      ? 'statusPageIo'
      : providerKey === 'Status Io'
      ? 'statusIo'
      : providerKey;
  const provider = providers[providerKey];
  // console.debug(provider);
  return provider;
};
