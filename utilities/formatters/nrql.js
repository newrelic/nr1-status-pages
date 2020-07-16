const NRQLSeverityToKnown = {
  None: 'none',
  Critical: 'critical',
  Warning: 'minor'
};

export const nrqlFormatter = data => {
  let statusCode = NRQLSeverityToKnown.None;
  let status = 'All Systems Operational';

  if (data.raw.results[0].events.length > 0) {
    const incident = data.raw.results[0].events[0];
    statusCode = NRQLSeverityToKnown[incident.EventStatus];

    if (statusCode !== NRQLSeverityToKnown.None) {
      status = 'Ongoing Issues';
    }
  }

  return {
    name: 'NRQL',
    description: status,
    indicator: statusCode
  };
};

export const nrqlIncidentFormatter = data => {
  return data.raw.results[0].events.map(incident => {
    const incident_updates = [];

    Object.entries(incident).forEach(([key, value]) => {
      incident_updates.push({
        created_at: incident.EventTimeStamp,
        body: `${key}: ${value}`
      });
    });

    return {
      name: incident.EventName,
      created_at: incident.EventTimeStamp,
      impact: NRQLSeverityToKnown[incident.EventStatus],
      incident_updates
    };
  });
};
