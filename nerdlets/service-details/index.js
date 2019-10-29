import React from 'react';
import { PlatformStateContext, NerdletStateContext } from 'nr1';
import ServiceDetails from './service-details';

export default class ServiceDetailsWrapper extends React.Component {
  render() {
    return (
      <div className="service-details-modal-container">
        <NerdletStateContext.Consumer>
          {nerdletUrlState => {
            const serviceName = nerdletUrlState.statusPageIoSummaryData.name;
            const { provider, hostname, timelineItemIndex } = nerdletUrlState;

            return (
              <React.Fragment>
                <h1 className="service-details-modal-heading">
                  {serviceName} incident history
                </h1>
                <ServiceDetails
                  hostname={hostname}
                  provider={provider}
                  timelineItemIndex={timelineItemIndex}
                ></ServiceDetails>
              </React.Fragment>
            );
          }}
        </NerdletStateContext.Consumer>
      </div>
    );
  }
}
