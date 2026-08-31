import { googleIncidentFormatter, googleFormatter } from './formatters/google';
import {
  statusPageIncidentFormatter,
  statusPageIoFormatter,
} from './formatters/status-page-io';
import {
  statusIoIncidentFormatter,
  statusIoFormatter,
} from './formatters/status-io';
import { nrqlFormatter, nrqlIncidentFormatter } from './formatters/nrql';
import { rssFormatter, rssIncidentFormatter } from './formatters/rss';
import {
  statusPalFormatter,
  statusPalIncidentFormatter,
} from './formatters/status-pal';
import {
  workloadFormatter,
  workloadIncidentFormatter,
} from './formatters/workload';
import { appleFormatter, appleIncidentFormatter } from './formatters/apple';
import {
  awsHealthFormatter,
  awsHealthIncidentFormatter,
} from './formatters/aws-health';
import { azureFormatter, azureIncidentFormatter } from './formatters/azure';
import { oktaFormatter, oktaIncidentFormatter } from './formatters/okta';
import { ociFormatter, ociIncidentFormatter } from './formatters/oci';
import { viaProxy } from './proxy';

const providers = {
  google: {
    summaryUrl: '/incidents.json',
    incidentUrl: '/incidents.json',
    name: 'Google Cloud',
    incidentFormatter: googleIncidentFormatter,
    summaryFormatter: googleFormatter,
  },
  statusPageIo: {
    summaryUrl: '/api/v2/summary.json',
    incidentUrl: '/api/v2/incidents.json',
    name: 'Status Page',
    summaryFormatter: statusPageIoFormatter,
    incidentFormatter: statusPageIncidentFormatter,
  },
  statusIo: {
    // assumes format entered of https://hostname/pages/history/<identifier>
    // will replace "pages/history" with "1.0/status"
    summaryUrl: '1.0/status',
    incidentUrl: '1.0/status',
    name: 'Status Io',
    summaryFormatter: statusIoFormatter,
    incidentFormatter: statusIoIncidentFormatter,
  },
  nrql: {
    name: 'NRQL',
    summaryFormatter: nrqlFormatter,
    incidentFormatter: nrqlIncidentFormatter,
  },
  workload: {
    name: 'Workload',
    summaryFormatter: workloadFormatter,
    incidentFormatter: workloadIncidentFormatter,
  },
  rss: {
    name: 'RSS Feed',
    summaryFormatter: rssFormatter,
    incidentFormatter: rssIncidentFormatter,
  },
  statusPal: {
    apiURL: viaProxy('https://statuspal.io/api/v2'),
    name: 'Statuspal',
    summaryFormatter: statusPalFormatter,
    incidentFormatter: statusPalIncidentFormatter,
  },
  apple: {
    name: 'Apple System Status',
    summaryFormatter: appleFormatter,
    incidentFormatter: appleIncidentFormatter,
  },
  awsHealth: {
    summaryUrl: '/public/currentevents',
    incidentUrl: '/public/currentevents',
    name: 'AWS Health',
    summaryFormatter: awsHealthFormatter,
    incidentFormatter: awsHealthIncidentFormatter,
  },
  azure: {
    name: 'Azure',
    summaryFormatter: azureFormatter,
    incidentFormatter: azureIncidentFormatter,
  },
  okta: {
    name: 'Okta',
    summaryFormatter: oktaFormatter,
    incidentFormatter: oktaIncidentFormatter,
  },
  oci: {
    summaryUrl: '/api/v2/status.json',
    incidentUrl: '/api/v2/incident-summary.rss',
    name: 'Oracle Cloud Infrastructure',
    summaryFormatter: ociFormatter,
    incidentFormatter: ociIncidentFormatter,
  },
};

// Nothing writes these display-name values today — every current caller
// passes the camelCase key. They're kept because `hostname.provider` is read
// back from NerdStorage, and records saved by older app versions may still
// hold a display name instead of a key.
const DISPLAY_NAME_ALIASES = {
  'Status Page': 'statusPageIo',
  'Status Io': 'statusIo',
  Statuspal: 'statusPal',
  'Apple System Status': 'apple',
  'AWS Health': 'awsHealth',
  NRQL: 'nrql',
  Workload: 'workload',
  'RSS Feed': 'rss',
  Azure: 'azure',
  Okta: 'okta',
  'Oracle Cloud Infrastructure': 'oci',
};

export const getProvider = (providerKey) => {
  const key = DISPLAY_NAME_ALIASES[providerKey] || providerKey;
  const provider = providers[key];
  if (!provider) {
    throw new Error(`Unknown status page provider: ${providerKey}`);
  }
  return provider;
};
