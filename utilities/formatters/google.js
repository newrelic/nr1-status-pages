const GoogleSeverityToKnown ={
    low: 'minor',
    medium: 'major',
    high: 'critical'
}

export const googleFormatter = (data) => {
    const formattedData = {};
    data = data.sort(incident => incident.begin)
    formattedData.name = 'Google Cloud Provider';
    const openIncident = data.find(incident => !incident.end || incident.end === '');
    if (openIncident) {
        formattedData.description = 'Ongoing Issues';
        formattedData.indicator = GoogleSeverityToKnown[openIncident.severity]
    } else {
        formattedData.description = 'All Systems Operational'
        formattedData.indicator = 'none';
    }
    return formattedData;
}

export const googleIncidentFormatter = (data) => {
    return data.map(incident => {
        return {
            name: incident.external_desc,
            created_at: incident.created,
            impact: GoogleSeverityToKnown[incident.severity],
            incident_updates: incident.updates.map(update => {
                return {
                     created_at: update.created,
                     body: update.text
                }
             })
        }
    })
}