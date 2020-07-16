import React from 'react';
import PropTypes from 'prop-types';
import Network from '../../utilities/network';
import FormatService from '../../utilities/format-service';
import dayjs from 'dayjs';

import { Icon, Button } from 'nr1';
import NRQLHelper from '../../utilities/nrql-helper';

const NRQL_PROVIDER_NAME = 'nrql';

export default class ServiceDetails extends React.PureComponent {
  static propTypes = {
    hostname: PropTypes.string,
    provider: PropTypes.string.isRequired,
    refreshRate: PropTypes.number,
    timelineItemIndex: PropTypes.object,
    nrqlQuery: PropTypes.string,
    accountId: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      currentIncidents: undefined,
      expandedTimelineItem: null
    };
  }

  componentDidMount() {
    const { timelineItemIndex, hostname, refreshRate, provider } = this.props;
    const { expandedTimelineItem } = this.state;

    this.setupTimelinePolling(hostname, refreshRate, provider);

    if (timelineItemIndex !== undefined && expandedTimelineItem === null) {
      this.setState({ expandedTimelineItem: timelineItemIndex });
    }
  }

  componentDidUpdate(prevProps) {
    const { timelineItemIndex, hostname, refreshRate, provider } = this.props;

    if (prevProps.timelineItemIndex !== timelineItemIndex) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ expandedTimelineItem: timelineItemIndex });
    }

    if (prevProps.hostname !== hostname) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ currentIncidents: undefined });
      this.setupTimelinePolling(hostname, refreshRate, provider);
    }
  }

  setupTimelinePolling = (hostname, refreshRate, provider) => {
    if (this.statusPageNetwork) this.statusPageNetwork.clear();

    this.FormatService = new FormatService(provider);

    if (NRQL_PROVIDER_NAME === provider) {
      const { nrqlQuery, accountId } = this.props;
      this.statusPageNetwork = new NRQLHelper(
        nrqlQuery,
        refreshRate,
        accountId
      );
    } else {
      this.statusPageNetwork = new Network(hostname, refreshRate, provider);
    }

    this.statusPageNetwork.pollCurrentIncidents(this.setIncidentData);
  };

  setIncidentData = data => {
    this.setState({
      currentIncidents: this.FormatService.uniformIncidentData(data)
    });
  };

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

  buildTimelineItemDetails(incident) {
    const incident_updates = incident.incident_updates.map(incident_update => {
      return (
        <li
          key={incident_update.created_at}
          className="timeline-item-contents-item"
        >
          <span className="key">
            {dayjs(incident_update.display_at).format('h:mm a')}:
          </span>
          <span className="value">{incident_update.body}</span>
        </li>
      );
    });

    return incident_updates;
  }

  handleTimelineItemClick = timelineItemId => {
    if (timelineItemId === this.state.expandedTimelineItem) {
      this.setState({
        expandedTimelineItem: null
      });
    } else {
      this.setState({
        expandedTimelineItem: timelineItemId
      });
    }
  };

  render() {
    const { currentIncidents, expandedTimelineItem } = this.state;
    if (!currentIncidents) return <div />;

    const items = currentIncidents.map((incident, incidentId) => {
      return (
        <div
          onClick={() => {
            this.handleTimelineItemClick(incidentId);
          }}
          className={`timeline-item impact-${incident.impact} ${
            expandedTimelineItem === incidentId ? 'timeline-item-expanded' : ''
          }`}
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
          <div className="timeline-item-dot" />
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
              <Button
                className="timeline-item-dropdown-arrow"
                type={Button.TYPE.PLAIN_NEUTRAL}
                iconType={
                  Button.ICON_TYPE
                    .INTERFACE__CHEVRON__CHEVRON_BOTTOM__V_ALTERNATE
                }
              />
            </div>
            {expandedTimelineItem === incidentId && (
              <div className="timeline-item-contents-container">
                <ul className="timeline-item-contents">
                  {this.buildTimelineItemDetails(incident)}
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    });
    return <div className="service-details-modal-container">{items}</div>;
  }
}
