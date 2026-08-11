import { useEffect, useState } from 'react';

import Network from '../utilities/network';
import NRQLHelper from '../utilities/nrql-helper';
import WorkloadHelper from '../utilities/workload-helper';
import RSSHelper from '../utilities/rss-helper';
import StatuspalHelper from '../utilities/statuspal-helper';
import AppleHelper from '../utilities/apple-helper';
import OciHelper from '../utilities/oci-helper';
import {
  uniformSummaryData,
  uniformIncidentData,
} from '../utilities/format-service';

const NRQL = 'nrql';
const WORKLOAD = 'workload';
const RSS = 'rss';
const STATUSPAL = 'statusPal';
const APPLE = 'apple';
const AZURE = 'azure';
const OKTA = 'okta';
const OCI = 'oci';

const MIN_REFRESH_RATE_SECONDS = 30;
const DEFAULT_REFRESH_RATE_SECONDS = 60;

const clampRefreshRate = (refreshRate) =>
  Number.isFinite(refreshRate) && refreshRate >= MIN_REFRESH_RATE_SECONDS
    ? refreshRate
    : DEFAULT_REFRESH_RATE_SECONDS;

const createHelper = ({
  provider,
  hostname,
  refreshRate,
  nrqlQuery,
  workloadGuid,
  subDomain,
  accountId,
}) => {
  const safeRefreshRate = clampRefreshRate(refreshRate);
  switch (provider) {
    case NRQL:
      return new NRQLHelper(nrqlQuery, safeRefreshRate, accountId);
    case WORKLOAD:
      return new WorkloadHelper(workloadGuid, safeRefreshRate, accountId);
    case RSS:
      return new RSSHelper(hostname, safeRefreshRate);
    case STATUSPAL:
      return new StatuspalHelper(subDomain, safeRefreshRate);
    case APPLE:
      return new AppleHelper(hostname, safeRefreshRate);
    case AZURE:
      return new RSSHelper(hostname, safeRefreshRate);
    case OKTA:
      return new RSSHelper(hostname, safeRefreshRate);
    case OCI:
      return new OciHelper(hostname, safeRefreshRate);
    default:
      return new Network(hostname, safeRefreshRate, provider);
  }
};

const useProviderPolling = ({
  provider,
  hostname,
  refreshRate,
  nrqlQuery,
  workloadGuid,
  subDomain,
  accountId,
  needsSummary = true,
}) => {
  const [summaryData, setSummaryData] = useState(undefined);
  const [incidents, setIncidents] = useState(undefined);
  const [errorInfo, setErrorInfo] = useState('');

  useEffect(() => {
    if (!provider) return undefined;

    let cancelled = false;

    setSummaryData(undefined);
    setIncidents(undefined);
    setErrorInfo('');

    const helper = createHelper({
      provider,
      hostname,
      refreshRate,
      nrqlQuery,
      workloadGuid,
      subDomain,
      accountId,
    });

    const applyBoth = (data) => {
      if (cancelled) return;
      if (typeof data === 'string') {
        setErrorInfo(data);
        return;
      }
      setErrorInfo('');
      if (needsSummary) setSummaryData(uniformSummaryData(provider, data));
      setIncidents(uniformIncidentData(provider, data));
    };
    const applySummary = (data) => {
      if (cancelled) return;
      if (typeof data === 'string') {
        setErrorInfo(data);
        return;
      }
      setErrorInfo('');
      setSummaryData(uniformSummaryData(provider, data));
    };
    const applyIncidents = (data) => {
      if (cancelled) return;
      if (typeof data === 'string') {
        setErrorInfo(data);
        return;
      }
      setIncidents(uniformIncidentData(provider, data));
    };

    if (helper instanceof Network) {
      if (helper.checkIfTheSameDataSource()) {
        helper.pollCurrentIncidents(applyBoth);
      } else {
        helper
          .pollCurrentIncidents(applyIncidents)
          .then(() => {
            if (needsSummary) return helper.pollSummaryData(applySummary);
            return undefined;
          })
          .catch((err) => console.error(err));
      }
    } else {
      helper.pollCurrentIncidents(applyBoth);
    }

    return () => {
      cancelled = true;
      helper.clear();
    };
  }, [
    provider,
    hostname,
    refreshRate,
    nrqlQuery,
    workloadGuid,
    subDomain,
    accountId,
    needsSummary,
  ]);

  return { summaryData, incidents, errorInfo };
};

export default useProviderPolling;
