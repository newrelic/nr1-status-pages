// https://kb.status.io/developers/public-status-api/

// Status Codes
// https://kb.status.io/developers/status-codes/
// 100 - Operational
// 300 - Degraded Performance
// 400 - Partial Service Disruption
// 500 - Service Disruption
// 600 - Security Event
const StatusIoSeverityToKnown = {
  100: 'none',
  300: 'minor',
  400: 'major',
  500: 'critical',
  600: 'critical',
};

// Example JSON here: https://ezidebit.status.io/1.0/status/598a973f96a8201305000142
export const statusIoFormatter = data => {
  //console.debug(data);

  const statusCode = data['result']['status_overall']['status_code'];
  const status = data['result']['status_overall']['status'];

  return {
    name: 'Status Io',
    description: status,
    indicator: StatusIoSeverityToKnown[statusCode],
  };
};

export const statusIoIncidentFormatter = data => {
  console.debug('Status Io Incidents: ' + data);
  return data.incidents;
};
