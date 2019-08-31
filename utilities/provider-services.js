
import { googleIncidentFormatter, googleFormatter } from "./formatters/google";
import { statusPageIncidentFormatter, statusPageIoFormatter } from "./formatters/status-page-io";

const providers = {
    aws: {
        summaryUrl: '',
        incidentUrl: '',
        impactMap: {
            low: 'minor',
            medium: 'major',
            high: 'critical'
        },
        name: "Amazon Web Services",
        incidentFormatter: awsIncidentFormatter,
        summaryFormatter: awsFormatter
    },
    google: {
        summaryUrl: '/incidents.json',
        incidentUrl: '/incidents.json',
        impactMap: {
            low: 'minor',
            medium: 'major',
            high: 'critical'
        },
        name: "Google Cloud Provider",
        incidentFormatter: googleIncidentFormatter,
        summaryFormatter: googleFormatter
    },
    statusPageIo: {
            summaryUrl: '/api/v2/summary.json',
            incidentUrl: '/api/v2/incidents.json',
            impactMap: {
                minor: 'minor',
                major: 'major',
                critical: 'critical'
            },
            name: "Google Cloud Provider",
            summaryFormatter: statusPageIoFormatter,
            incidentFormatter: statusPageIncidentFormatter
    }
}

export const getProvider = (providerKey) => {
    return providers[providerKey];
};