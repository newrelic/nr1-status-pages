// Shared by the NRQL and Workload incident formatters: both turn a flat NRQL
// result row into a list of "incident update" rows, one per non-timestamp
// column, with an optional per-key override (Workload uses this to swap
// EventStatus for a launcher deep link instead of a raw key/value row).
export const buildColumnIncidentUpdates = (incident, handlers = {}) => {
  const updates = [];

  Object.entries(incident).forEach(([key, value]) => {
    if (key.toLowerCase().includes('timestamp')) return;

    if (handlers[key]) {
      const update = handlers[key](value, incident);
      if (update) updates.push(update);
      return;
    }

    updates.push({
      created_at: incident.EventTimeStamp,
      body: `${key}: ${value}`,
    });
  });

  return updates;
};
