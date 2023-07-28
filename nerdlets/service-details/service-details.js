import React from 'react';
import PropTypes from 'prop-types';
import Network from '../../utilities/network';
import FormatService from '../../utilities/format-service';
import dayjs from 'dayjs';

import { Icon, Button } from 'nr1';
import NRQLHelper from '../../utilities/nrql-helper';
import RSSHelper from '../../utilities/rss-helper';
import StatuspalHelper from '../../utilities/statuspal-helper';
import WorkloadHelper from '../../utilities/workload-helper';

const NRQL_PROVIDER_NAME = 'nrql';
const WORKLOAD_PROVIDER_NAME = 'workload';
const RSS_PROVIDER_NAME = 'rss';
const STATUSPAL_PROVIDER_NAME = 'statusPal';

export default class ServiceDetails extends React.PureComponent {
  static propTypes = {
    hostname: PropTypes.string,
    provider: PropTypes.string.isRequired,
    refreshRate: PropTypes.number,
    timelineItemIndex: PropTypes.number,
    nrqlQuery: PropTypes.string,
    workloadGuid: PropTypes.string,
    subDomain: PropTypes.string,
    accountId: PropTypes.number
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
    const {
      timelineItemIndex,
      hostname,
      refreshRate,
      provider,
      nrqlQuery,
      workloadGuid,
      subDomain
    } = this.props;

    if (prevProps.timelineItemIndex !== timelineItemIndex) {
      this.setState({ expandedTimelineItem: timelineItemIndex });
    }

    if (
      prevProps.hostname !== hostname ||
      prevProps.subDomain !== subDomain ||
      prevProps.nrqlQuery !== nrqlQuery ||
      prevProps.workloadGuid !== workloadGuid
    ) {
      this.setState({ currentIncidents: undefined });
      this.setupTimelinePolling(hostname, refreshRate, provider);
    }
  }

  setupTimelinePolling = (hostname, refreshRate, provider) => {
    if (this.statusPageNetwork) this.statusPageNetwork.clear();

    this.FormatService = new FormatService(provider);

    if (provider === NRQL_PROVIDER_NAME) {
      const { nrqlQuery, accountId } = this.props;
      this.statusPageNetwork = new NRQLHelper(
        nrqlQuery,
        refreshRate,
        accountId
      );
    } else if (provider === WORKLOAD_PROVIDER_NAME) {
      const { workloadGuid, accountId } = this.props;
      this.statusPageNetwork = new WorkloadHelper(
        workloadGuid,
        refreshRate,
        accountId
      );
    } else if (provider === RSS_PROVIDER_NAME) {
      this.statusPageNetwork = new RSSHelper(hostname, refreshRate);
    } else if (provider === STATUSPAL_PROVIDER_NAME) {
      this.statusPageNetwork = new StatuspalHelper(
        this.props.subDomain,
        refreshRate
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
    switch (incidentImpact.toLowerCase()) {
      case 'unknown':
        return (
          <Icon
            className="timeline-item-symbol-icon"
            color="#464e4e"
            type={Icon.TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__BROWSER}
          />
        );
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
    const incident_updates = incident.incident_updates.map(
      (incident_update, index) => {
        let body = <span className="value">{incident_update.body}</span>;
        if (incident_update.link_url) {
          body = (
            <a href={incident_update.link_url} target="_blank" rel="noreferrer">
              {incident_update.body}
            </a>
          );
        }
        return (
          <li
            key={`${incident_update.created_at}-${index}`}
            className="timeline-item-contents-item"
          >
            <span className="key">
              {dayjs(incident_update.display_at).format('h:mm a')}:
            </span>
            {body}
          </li>
        );
      }
    );

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
          key={`${incident.created_at}-${incidentId}`}
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
                type={Button.TYPE.PLAIN}
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
