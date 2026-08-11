import React from 'react';
import { NerdletStateContext } from 'nr1';
import ServiceDetails from './service-details';

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

        return (
          <>
            <h1 className="service-details-modal-heading">
              {serviceName} Recent Incidents
            </h1>
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
