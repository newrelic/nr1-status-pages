export const PROVIDERS = {
  STATUS_PAGE: { value: 'statusPageIo', label: 'Status Page' },
  GOOGLE: { value: 'google', label: 'Google Cloud' },
  STATUS_IO: { value: 'statusIo', label: 'Status Io' },
  NRQL: { value: 'nrql', label: 'NRQL' },
  WORKLOAD: { value: 'workload', label: 'Workload' },
  RSS: { value: 'rss', label: 'RSS Feed' },
  STATUS_PAL: { value: 'statusPal', label: 'Statuspal' },
  APPLE: { value: 'apple', label: 'Apple System Status' },
  AWS_HEALTH: { value: 'awsHealth', label: 'AWS Health' },
  AZURE: { value: 'azure', label: 'Azure' },
  OKTA: { value: 'okta', label: 'Okta' },
  OCI: { value: 'oci', label: 'Oracle Cloud Infrastructure' },
};

export const PROVIDER_FIELD_CONFIG = {
  [PROVIDERS.NRQL.value]: {
    key: 'nrqlQuery',
    label: 'NRQL',
    placeholder: 'Put your NRQL query here',
  },
  [PROVIDERS.WORKLOAD.value]: {
    key: 'workloadGuid',
    label: 'Workload Guid',
    placeholder: 'Put your Workload Entity guid here',
  },
  [PROVIDERS.STATUS_PAL.value]: {
    key: 'subDomain',
    label: 'Subdomain',
    placeholder: 'Put your Statuspal subdomain here',
  },
};

export const DEFAULT_LOCATION_FIELD = {
  key: 'hostName',
  label: 'Hostname',
  placeholder: 'https://status.myservice.com/',
};
