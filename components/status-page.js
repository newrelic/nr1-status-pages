import React from 'react';
import PropTypes from 'prop-types';
import Summary from './summary';

import Network from '../utilities/network';
import CurrentIncidents from './current-incidents';
import FormatService from '../utilities/format-service';
import { Spinner } from 'nr1';

export default class StatusPage extends React.Component {
  static propTypes = {
    nerdletUrlState: PropTypes.object,
    launcherUrlState: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
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
    if (!statusPageIoSummaryData) return <Spinner />;

    const { provider } = this.props;
    return (
      <div
        className={`status-page-container status-${statusPageIoSummaryData.indicator}`}
      >
        <Summary
          refreshRate={this.props.refreshRate}
          hostname={this.props.hostname}
          provider={provider}
        />
        <CurrentIncidents
          refreshRate={this.props.refreshRate}
          hostname={this.props.hostname}
          provider={provider}
        />
      </div>
    );
  }
}
