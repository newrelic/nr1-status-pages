import React from 'react';
import IncidentDetails from './main-page';
import { PlatformStateContext, NerdletStateContext, AutoSizer } from 'nr1';

export default class Wrapper extends React.PureComponent {
  render() {
    return (
      <PlatformStateContext.Consumer>
        {platformUrlState => (
          <NerdletStateContext.Consumer>
            {nerdletUrlState => (
              <AutoSizer>
                {({ width, height }) => (
                  <IncidentDetails
                    launcherUrlState={platformUrlState}
                    nerdletUrlState={nerdletUrlState}
                    width={width}
                    height={height}
                  />
                )}
              </AutoSizer>
            )}
          </NerdletStateContext.Consumer>
        )}
      </PlatformStateContext.Consumer>
    );
  }
}
