import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import { Icon, Button } from 'nr1';

import useProviderPolling from '../../hooks/use-provider-polling';

const PROVIDERS_WITHOUT_HISTORY = ['awsHealth', 'azure'];

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
          className="timeline-item-symbol-icon"
          color="#9C5400"
          type={Icon.TYPE.DATE_AND_TIME__DATE_AND_TIME__TIME__A_REMOVE}
        />
      );
    case 'maintenance':
      return (
        <Icon
          className="timeline-item-symbol-icon"
          color="#9C5400"
          type={Icon.TYPE.INTERFACE__INFO__ANNOUNCEMENT}
        />
      );
  }
};

const buildTimelineItemDetails = (incident) =>
  (incident.incident_updates || []).map((incident_update) => {
    let body = (
      <span className="value">
        {incident_update.body
          ? incident_update.body
          : incident_update.description}
      </span>
    );
    if (incident_update.link_url) {
      body = (
        <a href={incident_update.link_url} target="_blank" rel="noreferrer">
          {incident_update.body}
        </a>
      );
    }
    const displayTime = dayjs(
      incident_update.display_at || incident_update.created_at
    ).format('h:mm a');
    const updateText =
      incident_update.body || incident_update.description || '';
    return (
      <li
        key={`${incident_update.created_at}-${updateText}`}
        className="timeline-item-contents-item"
      >
        <span className="key">{displayTime}:</span>
        {body}
      </li>
    );
  });

const ServiceDetails = ({
  hostname,
  provider,
  refreshRate,
  timelineItemIndex,
  nrqlQuery,
  workloadGuid,
  subDomain,
  accountId,
}) => {
  const { incidents } = useProviderPolling({
    provider,
    hostname,
    refreshRate,
    nrqlQuery,
    workloadGuid,
    subDomain,
    accountId,
    needsSummary: false,
  });

  const [thirtyDaysAgo] = useState(() => Date.now() - 30 * 24 * 60 * 60 * 1000);

  const recentIncidents = useMemo(() => {
    if (!incidents) return incidents;
    if (PROVIDERS_WITHOUT_HISTORY.includes(provider)) return incidents;
    return incidents.filter(
      (incident) => new Date(incident.created_at).getTime() >= thirtyDaysAgo
    );
  }, [incidents, provider, thirtyDaysAgo]);

  const [expandedTimelineItem, setExpandedTimelineItem] = useState(
    timelineItemIndex ?? null
  );

  useEffect(() => {
    setExpandedTimelineItem(timelineItemIndex ?? null);
  }, [timelineItemIndex]);

  const handleTimelineItemClick = useCallback(
    (id) => setExpandedTimelineItem((prev) => (prev === id ? null : id)),
    []
  );

  if (!recentIncidents) return <div />;

  return (
    <div className="service-details-modal-container">
      {recentIncidents.map((incident, incidentId) => (
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleTimelineItemClick(incidentId)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();
            handleTimelineItemClick(incidentId);
          }}
          className={`timeline-item impact-${incident.impact} ${
            expandedTimelineItem === incidentId ? 'timeline-item-expanded' : ''
          }`}
          key={`${incident.created_at}-${incident.name}`}
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
                  {buildTimelineItemDetails(incident)}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

ServiceDetails.propTypes = {
  hostname: PropTypes.string,
  provider: PropTypes.string.isRequired,
  refreshRate: PropTypes.number,
  timelineItemIndex: PropTypes.number,
  nrqlQuery: PropTypes.string,
  workloadGuid: PropTypes.string,
  subDomain: PropTypes.string,
  accountId: PropTypes.number,
};

export default ServiceDetails;
