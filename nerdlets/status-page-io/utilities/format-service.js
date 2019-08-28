
const GoogleMap = {
    name: {
        key: 'name'
    },
    description: {
        calc: {
            field: 'end',
            operator: '='

        }
    },
    indicator: 'status.impact'
}

const StatusPageIo = {
    name: {
        key: 'page.name'
    },
    description: {
        key:  'status.description'
    },
    indicator: {
        key:  'status.indicator'
    }
}

const GoogleSeverityToKnown ={
    low: 'minor',
    medium: 'major',
    high: 'critical'
}

export default class FormatService {

    constructor(provider) {
        this.provider = provider;
    }

    getProp(keyPath, data) {
        const returnProp = data;
        keyPath.split('.').forEach(key => {
            returnProp = returnProp[key]
        })
        return returnProp;
    }

    googleFormatter(data) {
        const formattedData = {};
        data = data.sort(incident => incident.begin)
        formattedData.name = 'Google Cloud Provider';
        const openIncident = data.find(incident => !incident.end || incident.end === '');
        if (openIncident) {
            formattedData.description = openIncident['most-recent-update'].description;
            formattedData.indicator = data.severity
        } else {
            formattedData.description = 'All Systems Operational'
            formattedData.indicator = '';
        }
        return formattedData;
    }

    awsFormatter(data){
        const incidents = data.successfulSet;
        const formattedData = {};
        formattedData.name = 'AWS';
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

    awsIncidentFormatter(data) {
        return data.successfulSet.map(incident => {
            return {
                name: incident.event.eventTypeCode,
                created_at: incident.event.startTime,
                impact: 'critical',
                incident_updates: [{
                    created_at: incident.event.lastUpdatedTime,
                    body: incident.eventDescription.latestDescription
                }
                ]
            };
        })
    }


    googleIncidentFormatter(data) {
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

    statusPageIoFormatter(data) {
        return {
            name: data['page']['name'],
            description: data['status']['description'],
            indicator: data['status']['indicator']
        }
    }

    uniformSummaryData(data) {
        const responseData = data.data;
        if (this.provider === 'google') {
            return this.googleFormatter(responseData);
        }else  if (this.provider === 'aws') {
            return this.awsFormatter(responseData);
        }
        else {
            return this.statusPageIoFormatter(responseData)
        }
    }

    uniformIncidentData(data) {
        const responseData = data.data;
        if (this.provider === 'google') {
            return this.googleIncidentFormatter(responseData);
        }else if (this.provider === 'aws') {
            return this.awsIncidentFormatter(responseData);
        } else {
            return responseData.incidents;
        }
    }
}