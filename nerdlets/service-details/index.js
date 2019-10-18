import React from 'react';
import { PlatformStateContext, NerdletStateContext } from 'nr1';

// https://docs.newrelic.com/docs/new-relic-programmable-platform-introduction

export default class ServiceDetails extends React.Component {
  render() {
    return (
      <div className="service-details-modal-container">
        <NerdletStateContext.Consumer>
          {nerdletUrlState => (
            <h1 className="service-details-modal-heading">
              {nerdletUrlState.statusPageIoSummaryData.name} incident history
            </h1>
          )}
        </NerdletStateContext.Consumer>
      </div>
    );
  }
}
