import { getProvider } from './provider-services';

export const uniformSummaryData = (providerKey, data) => {
  const provider = getProvider(providerKey);
  return provider.summaryFormatter(data?.data);
};

export const uniformIncidentData = (providerKey, data) => {
  const provider = getProvider(providerKey);
  return provider.incidentFormatter(data?.data);
};
