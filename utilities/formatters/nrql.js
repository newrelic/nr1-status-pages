import { buildColumnIncidentUpdates } from './incident-utils';

const NRQLSeverityToKnown = {
  None: 'none',
  Critical: 'critical',
  Warning: 'minor',
};

export const nrqlFormatter = (data) => {
  let statusCode = NRQLSeverityToKnown.None;
  let status = 'All Systems Operational';

  const events = data?.results?.[0]?.events || [];
  if (events.length > 0) {
    const incident = events[0];
    statusCode = NRQLSeverityToKnown[incident.EventStatus];

    if (statusCode === undefined) {
      statusCode = NRQLSeverityToKnown.None;
    }

    if (statusCode !== NRQLSeverityToKnown.None) {
      status = 'Ongoing Issues';
    }
  }

  return {
    name: 'NRQL',
    description: status,
    indicator: statusCode,
  };
};

export const nrqlIncidentFormatter = (data) => {
  return (data?.results?.[0]?.events || []).map((incident) => {
    const incident_updates = buildColumnIncidentUpdates(incident);
    let incidentCode = NRQLSeverityToKnown[incident.EventStatus];

    if (incidentCode === undefined) {
      incidentCode = NRQLSeverityToKnown.None;
    }

    return {
      name: incident.EventName,
      created_at: incident.EventTimeStamp,
      impact: incidentCode,
      incident_updates,
    };
  });
};
