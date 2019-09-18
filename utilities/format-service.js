import { getProvider } from './provider-services';

export default class FormatService {
  constructor(provider) {
    this.provider = getProvider(provider);
  }

  uniformSummaryData(data) {
    const responseData = data.data;
    return this.provider.summaryFormatter(responseData);
  }

  uniformIncidentData(data) {
    const responseData = data.data;
    return this.provider.incidentFormatter(responseData);
  }
}
