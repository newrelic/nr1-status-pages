export const rssFormatter = (data) => ({
  name: data?.title,
  description: data?.description,
  indicator: 'none',
  link: data?.link,
});

export const rssIncidentFormatter = (data) => {
  return (data?.items || []).map((incident) => {
    const incident_updates = [];

    incident_updates.push({
      created_at: incident.isoDate,
      body: `Link: ${incident.link}`,
    });

    incident_updates.push({
      created_at: incident.isoDate,
      body: `Description: ${incident.contentSnippet}`,
    });

    return {
      name: incident.title,
      created_at: incident.isoDate,
      impact: 'unknown',
      incident_updates,
    };
  });
};
