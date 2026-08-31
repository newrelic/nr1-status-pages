const StatuspalDescriptionMap = {
  null: 'All Systems Operational',
  minor: 'Minor System Outage',
  major: 'Major System Outage',
  maintenance: 'Service Under Maintenance',
  scheduled: 'Maintenance Scheduled',
};

export const statusPalFormatter = (data) => {
  const status = data?.status_page?.current_incident_type;

  return {
    name: data?.status_page?.name,
    description: StatuspalDescriptionMap[status],
    indicator: status === null ? 'none' : status,
  };
};

export const statusPalIncidentFormatter = (data) => {
  return (data?.incidents || []).map((incident) => {
    return {
      name: incident.title,
      created_at: incident.inserted_at,
      impact: incident.type,
      incident_updates: incident.updates || [],
    };
  });
};
