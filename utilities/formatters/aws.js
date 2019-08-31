export const awsFormatter = (data) => {
    const incidents = data.successfulSet;
    const formattedData = {};
    formattedData.name = data.name || 'AWS';
    const openIncident = incidents.find(incident => incident.event.statusCode === 'open');
    if (openIncident) {
        formattedData.description = openIncident.eventDescription.description;
        formattedData.indicator = 'critical'
    } else {
        formattedData.description = 'All Systems Operational'
        formattedData.indicator = '';
    }
    return formattedData;
}

export const awsIncidentFormatter = (data) => {
    return data.successfulSet.map(incident => {
        return {
            name: incident.event.eventTypeCode,
            created_at: incident.event.startTime,
            impact: 'critical',
            incident_updates: [{
                id: incident.event.arn,
                created_at: incident.event.lastUpdatedTime,
                body: incident.eventDescription.latestDescription
            }
            ]
        };
    })
}