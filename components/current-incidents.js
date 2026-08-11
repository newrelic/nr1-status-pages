import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import { Icon, Button } from 'nr1';

const AZURE_PROVIDER_NAME = 'azure';
const OKTA_PROVIDER_NAME = 'okta';
const APPLE_PROVIDER_NAME = 'apple';
const MICROSOFT_365_SERVICE_NAME = 'Microsoft 365';

const AZURE_STATUS_URL = 'https://azure.status.microsoft/en-us/status';
const MICROSOFT_365_STATUS_URL = 'https://status.cloud.microsoft/';
const OKTA_STATUS_URL = 'https://status.okta.com/';
const APPLE_STATUS_URL = 'https://developer.apple.com/system-status/';

const setTimelineSymbol = (incidentImpact) => {
  switch ((incidentImpact || '').toLowerCase()) {
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
          color="#9C5400"
          type={
            Icon.TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__APPLICATION__S_WARNING
          }
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
          type={Icon.TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__APPLICATION__S_ERROR}
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
    case 'scheduled':
      return (
        <Icon
          className="drilldown-item-symbol-icon"
          color="#9C5400"
          type={Icon.TYPE.DATE_AND_TIME__DATE_AND_TIME__TIME__A_REMOVE}
        />
      );
    case 'maintenance':
      return (
        <Icon
          className="drilldown-item-symbol-icon"
          color="#9C5400"
          type={Icon.TYPE.INTERFACE__INFO__ANNOUNCEMENT}
        />
      );
  }
};

const determineLink = (hostname) => {
  if (hostname.serviceName === MICROSOFT_365_SERVICE_NAME) {
    return MICROSOFT_365_STATUS_URL;
  } else if (hostname.provider === AZURE_PROVIDER_NAME) {
    return AZURE_STATUS_URL;
  } else if (hostname.provider === OKTA_PROVIDER_NAME) {
    return OKTA_STATUS_URL;
  } else if (hostname.provider === APPLE_PROVIDER_NAME) {
    return APPLE_STATUS_URL;
  } else if (hostname.hostName) {
    return hostname.hostName;
  }

  return hostname.hostName;
};

const PROVIDERS_WITHOUT_HISTORY = ['awsHealth', 'azure'];
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const CurrentIncidents = ({
  handleTileClick,
  hostname,
  provider,
  currentIncidents,
}) => {
  const [thirtyDaysAgo] = useState(() => Date.now() - THIRTY_DAYS_MS);

  const recentIncidents = PROVIDERS_WITHOUT_HISTORY.includes(provider)
    ? currentIncidents || []
    : (currentIncidents || []).filter(
        (incident) => new Date(incident.created_at).getTime() >= thirtyDaysAgo
      );

  if (recentIncidents.length === 0) {
    return (
      <div className="no-incident-history-container">
        <h4 className="no-incident-history-header">No incident history</h4>
        <Button
          className="no-incident-history-cta"
          iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__EXTERNAL_LINK}
          sizeType={Button.SIZE_TYPE.SMALL}
          to={determineLink(hostname)}
          onClick={(e) => e.stopPropagation()}
        >
          Go to status page
        </Button>
      </div>
    );
  }

  const first3Incidents = recentIncidents.slice(0, 3);

  return (
    <div className="timeline-container mini-timeline">
      {first3Incidents.map((incident, i) => (
        <div
          className={`timeline-item impact-${incident.impact}`}
          key={`${incident.created_at}-${incident.name}`}
          role="button"
          tabIndex={0}
          onClick={(e) => {
            handleTileClick(e, i);
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();
            handleTileClick(e, i);
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
          <div className="timeline-item-dot" />
          <div className="timeline-item-body">
            <div className="timeline-item-body-header">
              <div
                className="timeline-item-symbol"
                title={`Impact: ${incident.impact}`}
              >
                {setTimelineSymbol(incident.impact)}
              </div>
              <div className="timeline-item-title">
                {incident ? incident.name : 'None'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

CurrentIncidents.propTypes = {
  hostname: PropTypes.object,
  provider: PropTypes.string,
  handleTileClick: PropTypes.func,
  currentIncidents: PropTypes.array,
};

export default CurrentIncidents;
