import React from 'react';
import { NerdletStateContext } from 'nr1';
import ServiceDetails from './service-details';

export default class ServiceDetailsWrapper extends React.PureComponent {
  render() {
    return (
      <div className="service-details-modal-container">
        <NerdletStateContext.Consumer>
          {nerdletUrlState => {
            const serviceName = nerdletUrlState.statusPageIoSummaryData.name;
            const {
              provider,
              hostname,
              timelineItemIndex,
              refreshRate,
              nrqlQuery,
              subDomain,
              accountId
            } = nerdletUrlState;

            return (
              <>
                <h1 className="service-details-modal-heading">
                  {serviceName} incident history
                </h1>
                <ServiceDetails
                  hostname={hostname}
                  provider={provider}
                  refreshRate={refreshRate}
                  timelineItemIndex={timelineItemIndex}
                  nrqlQuery={nrqlQuery}
                  subDomain={subDomain}
                  accountId={accountId}
                />
              </>
            );
          }}
        </NerdletStateContext.Consumer>
      </div>
    );
  }
}
