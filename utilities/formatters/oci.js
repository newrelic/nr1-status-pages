export const ociFormatter = (data) => {
  const page = data?.status?.page;
  const status = data?.status?.status;

  const normalStatus = status?.description.toLowerCase().includes('normal')
    ? 'All Systems Operational'
    : status?.description;

  return {
    name: page?.name || 'Oracle Cloud Infrastructure',
    description: normalStatus || 'Unknown',
    indicator: status?.indicator || 'none',
  };
};

export const ociIncidentFormatter = (data) => {
  return (data?.feed?.items || []).map((incident) => ({
    name: incident.title,
    created_at: incident.isoDate,
    impact: 'unknown',
    incident_updates: [
      {
        created_at: incident.isoDate,
        display_at: incident.isoDate,
        body: incident.contentSnippet,
      },
    ],
  }));
};
