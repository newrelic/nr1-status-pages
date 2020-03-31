import React from 'react';
import StatusPagesDashboard from './main-page';
import { NerdletStateContext } from 'nr1';

export default class Wrapper extends React.PureComponent {
  render() {
    return (
      <NerdletStateContext.Consumer>
        {nerdletUrlState => {
          const { entityGuid } = nerdletUrlState;
          const type = entityGuid ? 'entity' : 'account';
          if (type === 'entity') {
            return <StatusPagesDashboard entityGuid={entityGuid} />;
          } else {
            return <StatusPagesDashboard />;
          }
        }}
      </NerdletStateContext.Consumer>
    );
  }
}
