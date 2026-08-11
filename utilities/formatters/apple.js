import { worstBy } from './impact-utils';

const STATUS_TYPE_TO_IMPACT = {
  outage: 'major',
  performance: 'minor',
  maintenance: 'minor',
};

const isActive = (event) => {
  const status = (event.eventStatus || '').toLowerCase();
  return status !== 'resolved' && status !== 'upcoming';
};

const mapImpact = (statusType) =>
  STATUS_TYPE_TO_IMPACT[(statusType || '').toLowerCase()] || 'minor';

const collectActiveEvents = (data) => {
  const active = [];
  (data.services || []).forEach((service) => {
    (service.events || []).forEach((event) => {
      if (isActive(event)) {
        active.push({ service, event });
      }
    });
  });
  return active;
};

const toIsoOrFallback = (epochStartDate, fallback) => {
  if (!epochStartDate) return fallback || '';
  const date = new Date(epochStartDate);
  return Number.isNaN(date.getTime()) ? fallback || '' : date.toISOString();
};

export const appleFormatter = (data) => {
  const active = collectActiveEvents(data);

  if (active.length === 0) {
    return {
      name: 'Apple System Status',
      description: 'All Services Operational',
      indicator: 'none',
    };
  }

  const { impact: worst, entry: worstEntry } = worstBy(active, (entry) =>
    mapImpact(entry.event.statusType)
  );

  return {
    name: 'Apple System Status',
    description:
      worstEntry.event.message ||
      `${active.length} active event${active.length === 1 ? '' : 's'}`,
    indicator: worst,
  };
};

export const appleIncidentFormatter = (data) => {
  const dedupeKeys = new Set();
  const incidents = [];

  collectActiveEvents(data).forEach(({ service, event }) => {
    const createdAt = toIsoOrFallback(event.epochStartDate, event.startDate);

    const affected = (
      event.affectedServices && event.affectedServices.length
        ? event.affectedServices
        : [service.serviceName]
    ).join(', ');

    const dedupeKey =
      event.messageId ||
      `${service.serviceName}|${event.statusType}|${createdAt}`;
    if (dedupeKeys.has(dedupeKey)) return;
    dedupeKeys.add(dedupeKey);

    incidents.push({
      name: `${affected}: ${event.statusType}`,
      created_at: createdAt,
      impact: mapImpact(event.statusType),
      incident_updates: [
        {
          created_at: createdAt,
          display_at: createdAt,
          body: event.message || '',
        },
      ],
    });
  });

  return incidents;
};
