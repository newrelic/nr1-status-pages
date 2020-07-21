import React from 'react';
import { NerdletStateContext } from 'nr1';

export default class Wrapper extends React.PureComponent {
  render() {
    return (
      <NerdletStateContext.Consumer>
        {nerdletUrlState => (
          <div className="container">
            <h1 className="heading">External status page</h1>
            <iframe src={nerdletUrlState.externalLink} />
          </div>
        )}
      </NerdletStateContext.Consumer>
    );
  }
}
