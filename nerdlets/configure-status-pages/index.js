import React from 'react';
import ConfigureStatusPages from './configure';
import { PlatformStateContext, NerdletStateContext } from 'nr1';

export default class Wrapper extends React.PureComponent {
  render() {
    return (
      <PlatformStateContext.Consumer>
        {platformUrlState => (
          <NerdletStateContext.Consumer>
            {nerdletUrlState => (
                <ConfigureStatusPages
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
