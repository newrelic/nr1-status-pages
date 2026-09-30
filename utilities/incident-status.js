const ALWAYS_ACTIVE_PROVIDERS = ['apple', 'awsHealth', 'okta', 'azure'];
const STATUS_PAGE_IO_INACTIVE_STATUSES = [
  'resolved',
  'postmortem',
  'completed',
];

export const isIncidentActive = (incident, provider) => {
  if (ALWAYS_ACTIVE_PROVIDERS.includes(provider)) return true;
  if (provider === 'google') return incident.active === true;
  if (provider === 'statusPageIo') {
    const status = (incident.status || '').toLowerCase();
    return !STATUS_PAGE_IO_INACTIVE_STATUSES.includes(status);
  }
  return false;
};
