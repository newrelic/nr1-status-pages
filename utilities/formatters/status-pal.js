const StatuspalDescriptionMap = {
  null: "All Systems Operational",
  "minor": "Minor System Outage",
  "major": "Major System Outage",
  "maintenance": "Service Under Maintenance"
}

export const statusPalFormatter = data => {
  data = remapData(data).status;

  const status = data.status_page.current_incident_type;

  return {
    name: data.status_page.name,
    description: StatuspalDescriptionMap[status],
    indicator: status === null ? "none" : status
  };
};

export const statusPalIncidentFormatter = data => {
  data = remapData(data).incidents;

  return data.incidents.map(incident => {
    return {
      name: incident.title,
      created_at: incident.inserted_at,
      impact: incident.type,
      incident_updates: []
    };
  });;
};

function remapData(data) {
  const obj = {};

  for (const key of Object.keys(data)) {
    const urlPaths = key.split("/");

    obj[urlPaths[urlPaths.length - 1]] = data[key];
  }

  return obj;
}
