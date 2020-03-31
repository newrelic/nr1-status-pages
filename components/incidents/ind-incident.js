import React from 'react';
import PropTypes from 'prop-types';
import IndUpdates from './ind-updates';

import { HeadingText } from 'nr1';

export default class IndIncident extends React.PureComponent {
  static propTypes = {
    incident: PropTypes.object
  };

  generateIncidentUpdates() {
    return this.props.incident.incident_updates.map(update => (
      <IndUpdates key={update.id} update={update} />
    ));
  }

  render() {
    const { incident } = this.props;
    const updates = this.generateIncidentUpdates();
    return (
      <div key={incident.id} className="ind-incident-container">
        <HeadingText type={HeadingText.TYPE.HEADING_2}>
          {incident.name}
        </HeadingText>
        <hr />
        <ul>{updates}</ul>
      </div>
    );
  }
}
