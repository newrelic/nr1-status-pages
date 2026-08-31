import React from 'react';
import { NerdletStateContext } from 'nr1';

const Wrapper = () => (
  <NerdletStateContext.Consumer>
    {(nerdletUrlState) => (
      <div className="container">
        <h1 className="heading">External status page</h1>
        <iframe
          src={nerdletUrlState.externalLink}
          title="External status page"
          sandbox="allow-scripts allow-popups"
        />
      </div>
    )}
  </NerdletStateContext.Consumer>
);

export default Wrapper;
