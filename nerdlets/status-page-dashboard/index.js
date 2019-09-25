import React from 'react';
import StatusPageIoMainPage from './main-page';
import { PlatformStateContext, NerdletStateContext, AutoSizer } from 'nr1';

export default class Wrapper extends React.PureComponent {
  render() {
    return (
      <PlatformStateContext.Consumer>
        {platformUrlState => (
          <NerdletStateContext.Consumer>
            {nerdletUrlState => (
              <StatusPageIoMainPage
                launcherUrlState={platformUrlState}
                nerdletUrlState={nerdletUrlState}
              />
            )}
          </NerdletStateContext.Consumer>
        )}
      </PlatformStateContext.Consumer>
    );
  }
}
