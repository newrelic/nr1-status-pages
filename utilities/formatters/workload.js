import { buildColumnIncidentUpdates } from './incident-utils';

const WorkloadSeverityToKnown = {
  0: 'none',
  1: 'minor',
  2: 'minor',
  3: 'critical',
};

export const workloadFormatter = (data) => {
  let statusCode = 'none';
  let status = 'All Systems Operational';

  const events = data?.results?.[0]?.events || [];
  if (events.length > 0) {
    const incident = events[0];
    statusCode = WorkloadSeverityToKnown[incident.EventStatus];

    if (statusCode === undefined || statusCode === 'none') {
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
    indicator: statusCode,
  };
};

// Region-specific: launcher deep links only resolve against one.newrelic.com.
// EU/gov accounts will need their own regional host here.
const LAUNCHER_FILTERS_BLOB = btoa(JSON.stringify({ wlFilters: '' }));
const launcherURL = `https://one.newrelic.com/launcher/nr1-core.explorer/?launcher=${LAUNCHER_FILTERS_BLOB}`;

const buildWorkloadDetailsPaneBlob = (workloadGuid) => {
  const pane = {
    nerdletId: 'workloads.detail',
    entityGuid: workloadGuid,
    isOverview: true,
    referrers: {
      launcherId: 'nr1-core.explorer',
      nerdletId: 'nr1-core.listing',
    },
    entitiesViewMode: 'HDV',
  };
  try {
    return btoa(JSON.stringify(pane));
  } catch {
    return null;
  }
};

export const workloadIncidentFormatter = (data) => {
  const paneBlob = buildWorkloadDetailsPaneBlob(data?.workloadGuid);

  return (data?.results?.[0]?.events || []).map((incident) => {
    const incident_updates = buildColumnIncidentUpdates(incident, {
      EventStatus: () =>
        paneBlob && {
          created_at: incident.EventTimeStamp,
          body: 'Workload Details',
          link_url: `${launcherURL}&pane=${paneBlob}`,
        },
    });
    let incidentCode = WorkloadSeverityToKnown[incident.EventStatus];

    if (incidentCode === undefined) {
      incidentCode = 'none';
    }

    return {
      name: incident.EventName,
      created_at: incident.EventTimeStamp,
      impact: incidentCode,
      incident_updates,
    };
  });
};
