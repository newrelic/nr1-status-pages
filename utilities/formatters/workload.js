const WorkloadSeverityToKnown = {
  0: 'none',
  1: 'minor',
  2: 'minor',
  3: 'critical'
};

export const workloadFormatter = data => {
  let statusCode = WorkloadSeverityToKnown.None;
  let status = 'All Systems Operational';

  if (data.results[0].events.length > 0) {
    const incident = data.results[0].events[0];
    statusCode = WorkloadSeverityToKnown[incident.EventStatus];

    if (statusCode === undefined) {
      statusCode = 'none';
    } else if (statusCode === 'minor') {
      status = 'Degraded';
    } else {
      status = 'Ongoing Issues';
    }
  }

  return {
    name: 'Workload',
    description: status,
    indicator: statusCode
  };
};

const launcherURL = `https://one.newrelic.com/launcher/nr1-core.explorer/?launcher=eyJ3bEZpbHRlcnMiOiIifQ==`;

export const workloadIncidentFormatter = data => {
  return data.results[0].events.map(incident => {
    const incident_updates = [];
    let incidentCode = WorkloadSeverityToKnown[incident.EventStatus];

    Object.entries(incident).forEach(([key, value]) => {
      if (key === 'EventStatus') {
        const encodeURL = `{"nerdletId":"workloads.detail","entityGuid":"${data.workloadGuid}","isOverview":true,"referrers":{"launcherId":"nr1-core.explorer","nerdletId":"nr1-core.listing"},"entitiesViewMode":"HDV"}`;
        incident_updates.push({
          created_at: incident.EventTimeStamp,
          body: 'Workload Details',
          link_url: `${launcherURL}&pane=${btoa(encodeURL)}`
        });
      } else if (!key.toLowerCase().includes('timestamp')) {
        incident_updates.push({
          created_at: incident.EventTimeStamp,
          body: `${key}: ${value}`
        });
      }
    });

    if (incidentCode === undefined) {
      incidentCode = 'none';
    }

    return {
      name: incident.EventName,
      created_at: incident.EventTimeStamp,
      impact: incidentCode,
      incident_updates
    };
  });
};
