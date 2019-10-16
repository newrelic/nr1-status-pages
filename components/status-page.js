import React from 'react';
import PropTypes from 'prop-types';
import Summary from './summary';

import Network from '../utilities/network';
import CurrentIncidents from './current-incidents';
import FormatService from '../utilities/format-service';
import { Spinner, Button, Icon } from 'nr1';

import GitHubLogo from '../assets/logo-github.svg';

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
          <img src={GitHubLogo} className="GitHubLogo" alt="GitHub" />
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
