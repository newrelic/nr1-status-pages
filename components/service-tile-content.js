import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Link } from 'nr1';

import CurrentIncidents from './current-incidents';

import GitHubLogo from '../assets/logo-github.svg';
import NewRelicLogo from '../assets/logo-new-relic-v2.png';
import JiraLogo from '../assets/logo-jira.png';
import GoogleCloudProviderLogo from '../assets/logo-google-cloud.svg';
import AppleLogo from '../assets/logo-apple.png';
import AWSLogo from '../assets/logo-aws.svg';
import AzureLogo from '../assets/logo-azure.png';
import MicrosoftLogo from '../assets/logo-msft-365.png';
import OktaLogo from '../assets/logo-okta.png';
import OCILogo from '../assets/logo-oracle-cloud.svg';

const NRQL_PROVIDER_NAME = 'nrql';
const WORKLOAD_PROVIDER_NAME = 'workload';
const RSS_PROVIDER_NAME = 'rss';

const autoSetLogo = (hostname) => {
  const { serviceName, hostName, hostLogo, provider } = hostname;

  if (provider === NRQL_PROVIDER_NAME || provider === WORKLOAD_PROVIDER_NAME) {
    if (hostLogo) {
      return <img src={hostLogo} className="service-logo" alt={provider} />;
    }
    return <h2 className="service-name">{serviceName}</h2>;
  }

  if (hostName.includes('githubstatus')) {
    return <img src={GitHubLogo} className="service-logo" alt="GitHub" />;
  } else if (hostName.includes('jira-software')) {
    return (
      <img
        src={JiraLogo}
        className="service-logo"
        alt="Jira"
        width="258"
        height="33"
      />
    );
  } else if (hostName.includes('newrelic')) {
    return (
      <img
        src={NewRelicLogo}
        className="service-logo"
        alt="New Relic"
        width="235"
        height="41"
      />
    );
  } else if (hostName.includes('cloud.google')) {
    return (
      <img
        src={GoogleCloudProviderLogo}
        className="service-logo"
        alt="GitHub"
      />
    );
  } else if (hostName.includes('apple')) {
    return <img src={AppleLogo} className="service-logo" alt="Apple" />;
  } else if (hostName.includes('health.aws')) {
    return <img src={AWSLogo} className="service-logo" alt="AWS" />;
  } else if (hostName.includes('azure.status.microsoft')) {
    return <img src={AzureLogo} className="service-logo" alt="Azure" />;
  } else if (hostName.includes('status.cloud.microsoft')) {
    return <img src={MicrosoftLogo} className="service-logo" alt="Microsoft" />;
  } else if (hostName.includes('OktaStatusRSS')) {
    return <img src={OktaLogo} className="service-logo" alt="Okta" />;
  } else if (hostName.includes('ocistatus.oraclecloud')) {
    return <img src={OCILogo} className="service-logo" alt="Oracle Cloud" />;
  } else if (hostLogo !== undefined && hostLogo !== '') {
    return (
      <img
        src={hostLogo}
        className="service-logo"
        alt={`${serviceName} logo`}
      />
    );
  }
  return <h2 className="service-name">{serviceName}</h2>;
};

const RssIcon = () => (
  <div className="rss-icon-container">
    <Icon
      color="#464e4e"
      type={Icon.TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__FEED}
    />
  </div>
);

const ServiceTileContent = ({
  contentRef,
  hostname,
  statusData,
  currentIncidents,
  settingsButton,
  onTileClick,
  onHeaderClick,
}) => (
  <div className="primary-status-page-content" ref={contentRef}>
    <div className="logo-container">
      {settingsButton}
      <button
        type="button"
        className="service-logo-button u-unstyledButton"
        onClick={onHeaderClick}
      >
        {autoSetLogo(hostname)}
        {hostname.provider === RSS_PROVIDER_NAME && <RssIcon />}
      </button>
    </div>
    <div className="service-current-status">
      {statusData.link ? (
        <h5 className="service-current-status-heading">
          <Link to={statusData.link}>See status page</Link>
        </h5>
      ) : (
        <button
          type="button"
          className="service-current-status-button u-unstyledButton"
          onClick={(e) => onTileClick(e, statusData)}
        >
          <h5 className="service-current-status-heading">
            {statusData.indicator?.toLowerCase() === 'unknown' && (
              <Icon type={Icon.TYPE.INTERFACE__INFO__HELP} />
            )}
            {statusData.indicator?.toLowerCase() === 'none' && (
              <Icon type={Icon.TYPE.INTERFACE__SIGN__CHECKMARK} />
            )}
            {statusData.indicator?.toLowerCase() === 'minor' && (
              <svg
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath={`url(#minor-icon-clip-${hostname.id})`}>
                  <path
                    d="M8.15 3.06L1.44 14.25C1.3 14.49 1.23 14.76 1.23 15.04C1.23 15.31 1.3 15.59 1.44 15.83C1.57 16.07 1.77 16.27 2.01 16.41C2.25 16.55 2.52 16.62 2.79 16.63H16.21C16.48 16.62 16.75 16.55 16.99 16.41C17.23 16.27 17.43 16.07 17.56 15.83C17.7 15.59 17.77 15.31 17.77 15.04C17.77 14.76 17.7 14.49 17.56 14.25L10.85 3.06C10.71 2.82 10.51 2.63 10.28 2.5C10.04 2.36 9.77 2.29 9.5 2.29C9.23 2.29 8.96 2.36 8.72 2.5C8.49 2.63 8.29 2.82 8.15 3.06V3.06Z"
                    stroke="#733E00"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.5 7.13V10.29"
                    stroke="#733E00"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.5 13.46V13.71"
                    stroke="#733E00"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id={`minor-icon-clip-${hostname.id}`}>
                    <rect width="19" height="19" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            )}
            {statusData.indicator?.toLowerCase() === 'major' && (
              <Icon type={Icon.TYPE.INTERFACE__SIGN__CLOSE} />
            )}
            {statusData.indicator?.toLowerCase() === 'critical' && (
              <Icon type={Icon.TYPE.INTERFACE__SIGN__CLOSE} />
            )}
            {statusData.indicator?.toLowerCase() === 'scheduled' && (
              <Icon
                type={Icon.TYPE.DATE_AND_TIME__DATE_AND_TIME__DATE__A_REMOVE}
                style={{ marginRight: '6px' }}
              />
            )}
            {statusData.indicator?.toLowerCase() === 'maintenance' && (
              <Icon type={Icon.TYPE.INTERFACE__INFO__ANNOUNCEMENT} />
            )}
            {statusData.description}
          </h5>
        </button>
      )}
    </div>
    <CurrentIncidents
      currentIncidents={currentIncidents}
      hostname={hostname}
      provider={hostname.provider}
      handleTileClick={(e, i) => onTileClick(e, statusData, i)}
    />
  </div>
);

ServiceTileContent.propTypes = {
  contentRef: PropTypes.object,
  hostname: PropTypes.object.isRequired,
  statusData: PropTypes.object.isRequired,
  currentIncidents: PropTypes.array.isRequired,
  settingsButton: PropTypes.node,
  onTileClick: PropTypes.func.isRequired,
  onHeaderClick: PropTypes.func.isRequired,
};

export default ServiceTileContent;
