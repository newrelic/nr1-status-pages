import React from 'react';
import PropTypes from 'prop-types';
import Network from '../../utilities/network';
import FormatService from '../../utilities/format-service';
import dayjs from 'dayjs';

import { Icon } from 'nr1';

export default class ServiceDetails extends React.Component {
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

  setTimelineSymbol(incidentImpact) {
    switch (incidentImpact) {
      case 'none':
        return (
          <Icon
            color="#464e4e"
            type={Icon.TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__APPLICATION__S_OK}
          />
        );
      case 'minor':
        return (
          <Icon
            color="#9C5400"
            type={
              Icon.TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__APPLICATION__S_WARNING
            }
          />
        );
      case 'major':
        return (
          <Icon
            color="#BF0016"
            type={
              Icon.TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__APPLICATION__S_ERROR
            }
          />
        );
      case 'critical':
        return (
          <Icon
            color="#ffffff"
            type={
              Icon.TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__APPLICATION__S_DISABLED
            }
          />
        );
    }
  }

  render() {
    const { currentIncidents } = this.state;
    if (!currentIncidents) return <div></div>;
    this.statusPageNetwork.refreshRateInSeconds = this.props.refreshRate;
    console.debug(currentIncidents);

    const items = currentIncidents.map(incident => {
      return (
        <div
          className={`timeline-item impact-${incident.impact}`}
          key={incident.created_at}
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
    return <div className="service-details-modal-container">{items}</div>;
  }
}
