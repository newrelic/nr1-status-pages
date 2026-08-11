export const azureFormatter = (data) => {
  const { title, items } = data || {};
  if (!items || items.length === 0) {
    return {
      name: title,
      description: 'All Services Operational',
      indicator: 'none',
    };
  }
  return {
    name: title,
    description: `${items.length} Active Incident${
      items.length === 1 ? '' : 's'
    }`,
    indicator: 'major',
  };
};

export const azureIncidentFormatter = (data) => {
  return (data?.items || []).map((incident) => ({
    name: incident.title,
    created_at: incident.isoDate,
    impact: 'major',
    incident_updates: [
      {
        created_at: incident.isoDate,
        display_at: incident.isoDate,
        body: `Link: ${incident.link}`,
      },
      {
        created_at: incident.isoDate,
        display_at: incident.isoDate,
        body: `Description: ${incident.contentSnippet}`,
      },
    ],
  }));
};
