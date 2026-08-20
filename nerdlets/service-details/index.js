import React from 'react';
import { Link, NerdletStateContext, navigation } from 'nr1';
import ServiceDetails from './service-details';
import { PROVIDERS } from '../status-page-dashboard/providers';

const MICROSOFT_365_FEED_HOST = 'status.cloud.microsoft';

const AZURE_STATUS_URL = 'https://azure.status.microsoft/en-us/status';
const MICROSOFT_365_STATUS_URL = 'https://status.cloud.microsoft/';
const OKTA_STATUS_URL = 'https://status.okta.com/';
const APPLE_STATUS_URL = 'https://developer.apple.com/system-status/';

const ServiceDetailsWrapper = () => (
  <div className="service-details-modal-container">
    <NerdletStateContext.Consumer>
      {(nerdletUrlState) => {
        const serviceName = nerdletUrlState.statusPageIoSummaryData?.name;
        const {
          provider,
          hostname,
          timelineItemIndex,
          refreshRate,
          nrqlQuery,
          workloadGuid,
          subDomain,
          accountId,
        } = nerdletUrlState;

        const fetchTitle = () => {
          if (provider === PROVIDERS.NRQL.value) {
            return 'View NRQL Results';
          } else if (provider === PROVIDERS.WORKLOAD.value) {
            return 'View Workload';
          }

          return 'View Status Page';
        };

        const handleHeaderClick = () => {
          if (provider === PROVIDERS.NRQL.value) {
            navigation.openStackedNerdlet({
              id: 'data-exploration.query-builder',
              urlState: {
                initialActiveInterface: 'nrqlEditor',
                initialAccountId: accountId,
                initialNrqlValue: nrqlQuery,
                initialWidget: { visualization: { id: 'viz.table' } },
                isViewingQuery: true,
              },
            });
          } else if (provider === PROVIDERS.WORKLOAD.value) {
            window
              .open(
                `https://one.newrelic.com/redirect/entity/${workloadGuid}`,
                '_blank'
              )
              .focus();
          } else if (hostname && hostname.includes(MICROSOFT_365_FEED_HOST)) {
            window.open(MICROSOFT_365_STATUS_URL, '_blank').focus();
          } else if (provider === PROVIDERS.AZURE.value) {
            window.open(AZURE_STATUS_URL, '_blank').focus();
          } else if (provider === PROVIDERS.OKTA.value) {
            window.open(OKTA_STATUS_URL, '_blank').focus();
          } else if (provider === PROVIDERS.APPLE.value) {
            window.open(APPLE_STATUS_URL, '_blank').focus();
          } else if (hostname) {
            window.open(hostname, '_blank').focus();
          }
        };

        return (
          <>
            <h2 className="service-details-modal-heading">
              {serviceName} Recent Incidents
            </h2>
            <div className="service-details-modal-link">
              <Link onClick={handleHeaderClick}>{fetchTitle()}</Link>
            </div>
            <ServiceDetails
              hostname={hostname}
              provider={provider}
              refreshRate={refreshRate}
              timelineItemIndex={timelineItemIndex}
              nrqlQuery={nrqlQuery}
              workloadGuid={workloadGuid}
              subDomain={subDomain}
              accountId={accountId}
            />
          </>
        );
      }}
    </NerdletStateContext.Consumer>
  </div>
);

export default ServiceDetailsWrapper;
