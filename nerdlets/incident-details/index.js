import React from 'react';
import StatusPageIoMainPage from './incident-details';
import { NerdletStateContext } from 'nr1';

export default class Wrapper extends React.PureComponent {
  render() {
    return (
      <NerdletStateContext.Consumer>
        {(nerdletUrlState) => (
          <StatusPageIoMainPage nerdletUrlState={nerdletUrlState} />
        )}
      </NerdletStateContext.Consumer>
    );
  }
}
