
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


    googleIncidentFormatter(data) {
        return data.map(incident => {

            incident.impact = GoogleSeverityToKnown[incident.severity];
            incident.name = incident.external_desc;
            incident.created_at = incident.created;
            incident.incident_updates = incident.updates.map(update => {
               return {
                    created_at: update.created,
                    body: update.text
               } 
            });
            return incident;
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
        } else {
            return this.statusPageIoFormatter(responseData)
        }
    }

    uniformIncidentData(data) {
        const responseData = data.data;
        if (this.provider === 'google') {
            return this.googleIncidentFormatter(responseData);
        } else {
            return responseData.incidents;
        }
    }
}