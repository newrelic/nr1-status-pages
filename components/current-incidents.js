import React from 'react';
import PropTypes from 'prop-types';
import Network from '../utilities/network';

import { navigation, Button, Stack, StackItem } from 'nr1';
import FormatService from '../utilities/format-service';

export default class CurrentIncidents extends React.Component {
  static propTypes = {
    hostname: PropTypes.string.isRequired,
    provider: PropTypes.string.isRequired,
    refreshRate: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentIncidents: undefined,
    };
    this.FormatService = new FormatService(this.props.provider);
    this.statusPageNetwork = new Network(
      this.props.hostname,
      this.props.refreshRate,
      this.props.provider
    );
    this.seeMore = this.seeMore.bind(this);
  }

  seeMore() {
    const nerdletWithState = {
      id: 'incident-details',
      urlState: {
        hostname: this.props.hostname,
        provider: this.props.provider,
      },
    };
    navigation.openStackedNerdlet(nerdletWithState);
  }

  componentDidMount() {
    this.statusPageNetwork.pollCurrentIncidents(
      this.setIncidentData.bind(this)
    );
  }

  setIncidentData(data) {
    this.setState({
      currentIncidents: this.FormatService.uniformIncidentData(data),
    });
  }

  render() {
    const { currentIncidents } = this.state;
    if (!currentIncidents) return <div></div>;
    this.statusPageNetwork.refreshRateInSeconds = this.props.refreshRate;
    const latestIncident = currentIncidents[0];
    const first3Incicdents = currentIncidents.slice(0, 3);
    const first3TimelineItems = first3Incicdents.map(incident => {
      return (
        <div className="timeline-item" key={incident.created_at}>
          <div className="timeline-item-timestamp">
            <span className="timeline-timestamp-date">
              {incident.created_at}
            </span>
            <span className="timeline-timestamp-time">
              {incident.created_at}
            </span>
          </div>
          <div className="timeline-item-dot"></div>
          <div className="timeline-item-body">
            <div className="timeline-item-body-header">
              <div className="timeline-item-symbol"></div>
              <div className="timeline-item-title">
                {incident ? incident.name : 'None'}
              </div>
              <Button
                className="timeline-item-dropdown-arrow"
                type={Button.TYPE.PLAIN_NEUTRAL}
                iconType={
                  Button.ICON_TYPE
                    .INTERFACE__CHEVRON__CHEVRON_BOTTOM__V_ALTERNATE
                }
              ></Button>
            </div>
          </div>
        </div>
      );
    });

    // Show first current incident and then add a see more button
    return first3TimelineItems;
  }
}
