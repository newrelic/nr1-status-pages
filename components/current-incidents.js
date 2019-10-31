import React from 'react';
import PropTypes from 'prop-types';
import Network from '../utilities/network';
import dayjs from 'dayjs';

import { navigation, Icon, Button } from 'nr1';
import FormatService from '../utilities/format-service';
import { hostname } from 'os';

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
      isPolling: false,
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
      this.setIncidentData.bind(this),
      () => this.setState({ isPolling: !this.state.isPolling })
    );
  }

  setTimelineSymbol(incidentImpact) {
    switch (incidentImpact) {
      case 'none':
        return (
          <Icon
            className="timeline-item-symbol-icon"
            color="#464e4e"
            type={Icon.TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__APPLICATION__S_OK}
          />
        );
      case 'minor':
        return (
          <Icon
            className="timeline-item-symbol-icon"
            color="#9C5400"
            type={
              Icon.TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__APPLICATION__S_WARNING
            }
          />
        );
      case 'major':
        return (
          <Icon
            className="timeline-item-symbol-icon"
            color="#BF0016"
            type={
              Icon.TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__APPLICATION__S_ERROR
            }
          />
        );
      case 'critical':
        return (
          <Icon
            className="timeline-item-symbol-icon"
            color="#ffffff"
            type={
              Icon.TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__APPLICATION__S_DISABLED
            }
          />
        );
    }
  }

  setIncidentData(data) {
    this.setState({
      currentIncidents: this.FormatService.uniformIncidentData(data),
      isPolling: false,
    });
  }

  render() {
    const { handleTileClick, hostname } = this.props;
    const { currentIncidents } = this.state;

    if (!currentIncidents || currentIncidents.length === 0) {
      return (
        <div className="no-incident-history-container">
          <h4 className="no-incident-history-header">No incident history</h4>
          <Button
            className="no-incident-history-cta"
            iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__EXTERNAL_LINK}
            sizeType={Button.SIZE_TYPE.SMALL}
            to={hostname}
            onClick={e => e.stopPropagation()}
          >
            Go to status page
          </Button>
        </div>
      );
    }

    this.statusPageNetwork.refreshRateInSeconds = this.props.refreshRate;
    const first3Incicdents = currentIncidents.slice(0, 3);
    const first3TimelineItems = first3Incicdents.map((incident, i) => {
      return (
        <div
          className={`timeline-item impact-${incident.impact}`}
          key={incident.created_at}
          onClick={e => {
            handleTileClick(i);
            e.stopPropagation();
          }}
        >
          <div className="timeline-item-timestamp">
            <span className="timeline-timestamp-date">
              {dayjs(incident.created_at).format('MM/DD/YYYY')}
            </span>
            <span className="timeline-timestamp-time">
              {dayjs(incident.created_at).format('h:mm a')}
            </span>
          </div>
          <div className="timeline-item-dot"></div>
          <div className="timeline-item-body">
            <div className="timeline-item-body-header">
              <div
                className="timeline-item-symbol"
                title={`Impact: ${incident.impact}`}
              >
                {this.setTimelineSymbol(incident.impact)}
              </div>
              <div className="timeline-item-title">
                {incident ? incident.name : 'None'}
              </div>
            </div>
          </div>
        </div>
      );
    });

    // Show first current incident and then add a see more button
    return (
      <div className="timeline-container mini-timeline">
        {first3TimelineItems}
      </div>
    );
  }
}
