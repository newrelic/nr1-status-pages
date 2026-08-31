const RESOLVED_STATUS = '0';
const STATUS_TYPE_TO_IMPACT = {
  1: 'minor',
  2: 'major',
  3: 'critical',
};

const toIso = (value) => {
  if (value === undefined || value === null || value === '') return '';
  const seconds = Number(value);
  if (Number.isNaN(seconds)) return '';
  return new Date(seconds * 1000).toISOString();
};

const isActive = (event) => String(event.status) !== RESOLVED_STATUS;

const mapImpact = (status) => STATUS_TYPE_TO_IMPACT[status] || 'minor';

const collectActive = (data) =>
  Array.isArray(data) ? data.filter(isActive) : [];

export const awsHealthFormatter = (data) => {
  const active = collectActive(data);

  if (active.length === 0) {
    return {
      name: 'AWS Health',
      description: 'All Services Operational',
      indicator: 'none',
    };
  }

  return {
    name: 'AWS Health',
    description: 'Ongoing Issues',
    indicator: mapImpact(active[0].status),
  };
};

export const awsHealthIncidentFormatter = (data) => {
  if (!Array.isArray(data)) return [];

  return data.reduce((incidents, event) => {
    if (!isActive(event)) return incidents;

    const createdAt = toIso(event.date);
    const logs = Array.isArray(event.event_log) ? event.event_log : [];

    const incident_updates = logs.length
      ? logs
          .toSorted((a, b) => b.timestamp - a.timestamp)
          .map((log) => {
            const logTime = toIso(log.timestamp) || createdAt;
            return {
              created_at: logTime,
              display_at: logTime,
              body: log.message || log.summary || '',
            };
          })
      : [
          {
            created_at: createdAt,
            display_at: createdAt,
            body: event.summary || '',
          },
        ];

    incidents.push({
      name: `${event.service_name || event.service} — ${event.region_name}: ${
        event.summary || 'Service Issue'
      }`,
      created_at: createdAt,
      impact: mapImpact(event.status),
      incident_updates,
    });
    return incidents;
  }, []);
};
