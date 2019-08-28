
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
        currentImpact: {}
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
        currentImpact: {}
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
            currentImpact: {}
    }
}

export const getProvider = (providerKey) => {
    return providers[providerKey];
};