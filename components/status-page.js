import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import useProviderPolling from '../hooks/use-provider-polling';
import { Spinner, navigation } from 'nr1';

import ServiceSettingsMenu from './service-settings-menu';
import ServiceSettingsForm from './service-settings-form';
import ServiceTileContent from './service-tile-content';

const NRQL_PROVIDER_NAME = 'nrql';
const WORKLOAD_PROVIDER_NAME = 'workload';
const AZURE_PROVIDER_NAME = 'azure';
const OKTA_PROVIDER_NAME = 'okta';
const APPLE_PROVIDER_NAME = 'apple';
const MICROSOFT_365_SERVICE_NAME = 'Microsoft 365';

const AZURE_STATUS_URL = 'https://azure.status.microsoft/en-us/status';
const MICROSOFT_365_STATUS_URL = 'https://status.cloud.microsoft/';
const OKTA_STATUS_URL = 'https://status.okta.com/';
const APPLE_STATUS_URL = 'https://developer.apple.com/system-status/';

const DragHandleIcon = () => (
  <svg
    width="12"
    height="16"
    viewBox="0 0 12 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="4" cy="3" r="1.5" />
    <circle cx="4" cy="8" r="1.5" />
    <circle cx="4" cy="13" r="1.5" />
    <circle cx="8" cy="3" r="1.5" />
    <circle cx="8" cy="8" r="1.5" />
    <circle cx="8" cy="13" r="1.5" />
  </svg>
);

const StatusPage = ({
  hostname,
  refreshRate,
  handleDeleteTileModal,
  editHostName,
  setServiceTileRef,
  accountId,
  dragHandleListeners,
  dragHandleAttributes,
}) => {
  const { summaryData, incidents, errorInfo } = useProviderPolling({
    provider: hostname.provider,
    hostname: hostname.hostName,
    refreshRate,
    nrqlQuery: hostname.nrqlQuery,
    workloadGuid: hostname.workloadGuid,
    subDomain: hostname.subDomain,
    accountId,
  });

  const [settingsViewActive, setSettingsViewActive] = useState(false);

  const serviceTilePrimaryContent = useRef(null);
  const serviceTileSettingsContent = useRef(null);

  const handleTileSettingsAnimation = useCallback(() => {
    const primaryContent = serviceTilePrimaryContent.current;
    const settingsContent = serviceTileSettingsContent.current;

    if (settingsViewActive) {
      settingsContent.animate(
        {
          visibility: ['visible', 'hidden'],
          opacity: [1, 0],
          transform: [
            'translateX(0) rotateY(0)',
            'translateX(30px) rotateY(25deg)',
          ],
        },
        {
          duration: 400,
          fill: 'forwards',
          easing: 'cubic-bezier(.23, 1, .32, 1)',
        }
      );

      primaryContent.animate(
        {
          opacity: [0, 1],
          transform: [
            'translateX(-30px) rotateY(-15deg)',
            'translateX(0) rotateY(0deg)',
          ],
        },
        {
          duration: 400,
          fill: 'forwards',
          easing: 'cubic-bezier(.25, .46, .45, .94)',
          delay: 200,
        }
      );
      setSettingsViewActive(false);
    } else {
      settingsContent.animate(
        {
          visibility: ['hidden', 'visible'],
          opacity: [0, 1],
          transform: [
            'translateX(30px) rotateY(15deg)',
            'translateX(0) rotateY(0deg)',
          ],
        },
        {
          duration: 400,
          fill: 'forwards',
          easing: 'cubic-bezier(.25, .46, .45, .94)',
          delay: 200,
        }
      );

      const animatePrimaryContentOut = primaryContent.animate(
        {
          opacity: [1, 0],
          transform: [
            'translateX(0) rotateY(0)',
            'translateX(-30px) rotateY(-25deg)',
          ],
        },
        {
          duration: 400,
          fill: 'forwards',
          easing: 'cubic-bezier(.23, 1, .32, 1)',
        }
      );

      animatePrimaryContentOut.onfinish = () => setSettingsViewActive(true);
    }
  }, [settingsViewActive]);

  const handleTileClick = useCallback(
    (e, statusData, selectedIndex) => {
      if (e.target.closest('.destructive')) return;

      const baseUrlState = {
        statusPageIoSummaryData: statusData,
        refreshRate,
        hostname: hostname.hostName,
        provider: hostname.provider,
        nrqlQuery: hostname.nrqlQuery,
        workloadGuid: hostname.workloadGuid,
        subDomain: hostname.subDomain,
        accountId,
      };

      if (selectedIndex !== undefined) {
        navigation.openStackedNerdlet({
          id: 'service-details',
          urlState: { ...baseUrlState, timelineItemIndex: selectedIndex },
        });
        e.stopPropagation();
      } else {
        navigation.openStackedNerdlet({
          id: 'service-details',
          urlState: baseUrlState,
        });
      }
    },
    [accountId, refreshRate, hostname]
  );

  const handleHeaderClick = useCallback(
    (e) => {
      if (e.target.closest('.service-settings-button-container')) return;
      e.stopPropagation();
      if (hostname.provider === NRQL_PROVIDER_NAME) {
        navigation.openStackedNerdlet({
          id: 'data-exploration.query-builder',
          urlState: {
            initialActiveInterface: 'nrqlEditor',
            initialAccountId: accountId,
            initialNrqlValue: hostname.nrqlQuery,
            initialWidget: { visualization: { id: 'viz.table' } },
            isViewingQuery: true,
          },
        });
      } else if (hostname.provider === WORKLOAD_PROVIDER_NAME) {
        window
          .open(
            `https://one.newrelic.com/redirect/entity/${hostname.workloadGuid}`,
            '_blank'
          )
          .focus();
      } else if (hostname.serviceName === MICROSOFT_365_SERVICE_NAME) {
        window.open(MICROSOFT_365_STATUS_URL, '_blank').focus();
      } else if (hostname.provider === AZURE_PROVIDER_NAME) {
        window.open(AZURE_STATUS_URL, '_blank').focus();
      } else if (hostname.provider === OKTA_PROVIDER_NAME) {
        window.open(OKTA_STATUS_URL, '_blank').focus();
      } else if (hostname.provider === APPLE_PROVIDER_NAME) {
        window.open(APPLE_STATUS_URL, '_blank').focus();
      } else if (hostname.hostName) {
        window.open(hostname.hostName, '_blank').focus();
      }
    },
    [hostname, accountId]
  );

  const handleDelete = useCallback(
    () => handleDeleteTileModal(hostname),
    [handleDeleteTileModal, hostname]
  );

  const handleSave = useCallback(
    (hostNameObject) => {
      editHostName(hostNameObject);
      handleTileSettingsAnimation();
    },
    [editHostName, handleTileSettingsAnimation]
  );

  const renderLoadingState = () => (
    <div
      className={`status-page-container ${
        settingsViewActive ? 'settings-view-active' : 'settings-view-inactive'
      }`}
    >
      {dragHandleListeners && (
        <div
          className="drag-handle"
          {...dragHandleListeners}
          {...dragHandleAttributes}
        >
          <DragHandleIcon />
        </div>
      )}
      <ServiceSettingsMenu
        onEdit={handleTileSettingsAnimation}
        onDelete={handleDelete}
      />
      <Spinner fillContainer />
      <ServiceSettingsForm
        hostname={hostname}
        contentRef={serviceTileSettingsContent}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );

  const renderErrorState = () => (
    <div
      className="primary-status-page-content"
      ref={serviceTilePrimaryContent}
    >
      <div className="logo-container">
        <ServiceSettingsMenu
          onEdit={handleTileSettingsAnimation}
          onDelete={handleDelete}
        />
      </div>
      <div className="service-current-status">
        <div className="status-page-container-error">{errorInfo}</div>
      </div>
    </div>
  );

  if (!summaryData && !errorInfo) {
    return renderLoadingState();
  }

  const currentIncidents = incidents ?? [];
  const statusData = summaryData ?? {};

  return (
    <div
      className={`status-page-container status-${(
        statusData.indicator ?? 'unknown'
      ).toLowerCase()} ${
        settingsViewActive ? 'settings-view-active' : 'settings-view-inactive'
      }`}
      ref={setServiceTileRef}
    >
      {dragHandleListeners && (
        <div
          className="drag-handle"
          {...dragHandleListeners}
          {...dragHandleAttributes}
        >
          <DragHandleIcon />
        </div>
      )}
      {errorInfo && renderErrorState()}
      {!errorInfo && (
        <ServiceTileContent
          contentRef={serviceTilePrimaryContent}
          hostname={hostname}
          statusData={statusData}
          currentIncidents={currentIncidents}
          settingsButton={
            <ServiceSettingsMenu
              onEdit={handleTileSettingsAnimation}
              onDelete={handleDelete}
            />
          }
          onTileClick={handleTileClick}
          onHeaderClick={handleHeaderClick}
        />
      )}
      <ServiceSettingsForm
        hostname={hostname}
        contentRef={serviceTileSettingsContent}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
};

StatusPage.propTypes = {
  hostname: PropTypes.object.isRequired,
  refreshRate: PropTypes.number,
  handleDeleteTileModal: PropTypes.func,
  editHostName: PropTypes.func,
  setServiceTileRef: PropTypes.object,
  accountId: PropTypes.number,
  dragHandleListeners: PropTypes.object,
  dragHandleAttributes: PropTypes.object,
};

export default StatusPage;
