import React from 'react';
import PropTypes from 'prop-types';
import Summary from './summary';

import Network from '../utilities/network';
import CurrentIncidents from './current-incidents';
import FormatService from '../utilities/format-service';
import { Spinner, Button, Icon } from 'nr1';

import GitHubLogo from '../assets/logo-github.svg';
import NewRelicLogo from '../assets/logo-new-relic.png';
import JiraLogo from '../assets/logo-jira.png';
import GoogleCloudProviderLogo from '../assets/logo-google-cloud.svg';

export default class StatusPage extends React.Component {
  static propTypes = {
    hostname: PropTypes.string.isRequired,
    provider: PropTypes.string.isRequired,
    refreshRate: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.StatusPageNetwork = new Network(
      this.props.hostname,
      this.props.refreshRate,
      this.props.provider
    );
    this.FormatService = new FormatService(this.props.provider);
    this.state = {
      statusPageIoSummaryData: undefined,
    };
  }

  async componentDidMount() {
    this.StatusPageNetwork.pollSummaryData(this.setSummaryData.bind(this));
  }

  autoSetLogo(serviceName) {
    switch (serviceName) {
      case 'GitHub':
        return <img src={GitHubLogo} className="service-logo" alt="GitHub" />;
      case 'Jira Software':
        return (
          <img
            src={JiraLogo}
            className="service-logo"
            alt="Jira"
            width="258"
            height="33"
          />
        );
      case 'New Relic':
        return (
          <img
            src={NewRelicLogo}
            className="service-logo"
            alt="New Relic"
            width="235"
            height="41"
          />
        );
      case 'Google Cloud Provider':
        return (
          <img
            src={GoogleCloudProviderLogo}
            className="service-logo"
            alt="GitHub"
          />
        );
      default:
        return <h2 className="service-name">{serviceName}</h2>;
    }
  }

  setSummaryData(data) {
    this.setState({
      statusPageIoSummaryData: this.FormatService.uniformSummaryData(data),
    });
  }

  render() {
    const { statusPageIoSummaryData } = this.state;
    if (!statusPageIoSummaryData) return <Spinner fillContainer />;

    const { provider, refreshRate, hostname } = this.props;
    return (
      <div
        className={`status-page-container status-${statusPageIoSummaryData.indicator}`}
      >
        <div className="logo-container">
          <Button
            sizeType={Button.SIZE_TYPE.SMALL}
            className="service-settings-button"
            type={Button.TYPE.NORMAL}
            iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__MORE}
          />

          {this.autoSetLogo(statusPageIoSummaryData.name)}
        </div>
        <div className="service-current-status">
          <h5 className="service-current-status-heading">
            <Icon type={Icon.TYPE.INTERFACE__SIGN__CHECKMARK} />
            {statusPageIoSummaryData.description}
          </h5>
        </div>
        <CurrentIncidents
          refreshRate={refreshRate}
          hostname={hostname}
          provider={provider}
        />
      </div>
    );
  }
}
