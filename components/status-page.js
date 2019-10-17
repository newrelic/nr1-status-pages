import React from 'react';
import PropTypes from 'prop-types';
import Summary from './summary';

import Network from '../utilities/network';
import CurrentIncidents from './current-incidents';
import FormatService from '../utilities/format-service';
import { Spinner, Button, Icon, TextField, Dropdown, DropdownItem } from 'nr1';
import CreatableSelect from 'react-select/creatable';

import GitHubLogo from '../assets/logo-github.svg';
import NewRelicLogo from '../assets/logo-new-relic.png';
import JiraLogo from '../assets/logo-jira.png';
import GoogleCloudProviderLogo from '../assets/logo-google-cloud.svg';

const createOption = label => ({
  label,
  value: label,
});
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
      inputValue: '',
      value: [],
    };
  }

  async componentDidMount() {
    this.StatusPageNetwork.pollSummaryData(this.setSummaryData.bind(this));
  }

  handleSelectChange = (value, actionMeta) => {
    console.group('Value Changed');
    console.log(value);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    this.setState({ value });
  };
  handleSelectInputChange = inputValue => {
    this.setState({ inputValue });
  };

  handleSelectKeyDown = event => {
    const { inputValue, value } = this.state;
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        console.group('Value Added');
        console.log(value);
        console.groupEnd();
        this.setState({
          inputValue: '',
          value: [...value, createOption(inputValue)],
        });
        event.preventDefault();
    }
  };

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
    const { statusPageIoSummaryData, inputValue, value } = this.state;
    if (!statusPageIoSummaryData) return <Spinner fillContainer />;

    const { provider, refreshRate, hostname } = this.props;

    return (
      <div
        className={`status-page-container status-${statusPageIoSummaryData.indicator}`}
      >
        <div className="primary-status-page-content">
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
        <div className="status-page-settings-container">
          <div className="status-page-settings-content">
            <TextField
              label="Service name"
              className="status-page-setting"
            ></TextField>
            <TextField
              label="Hostname"
              placeholder="https://status.myservice.com/"
              className="status-page-setting"
            ></TextField>
            <Dropdown label="Provider" className="status-page-setting">
              <DropdownItem selected>Status Page</DropdownItem>
              <DropdownItem>Google</DropdownItem>
            </Dropdown>
            <div className="input-group status-page-setting">
              <label className="TextField-label">
                External dependancy tags
              </label>
              <CreatableSelect
                components={{ DropdownIndicator: null }}
                inputValue={inputValue}
                isClearable
                isMulti
                menuIsOpen={false}
                onChange={this.handleSelectChange}
                onInputChange={this.handleSelectInputChange}
                onKeyDown={this.handleSelectKeyDown}
                placeholder="Enter a tag and press enter..."
                value={value}
                classNamePrefix="react-select"
              />
            </div>
            <TextField
              label="Service logo"
              className="status-page-setting"
            ></TextField>
          </div>
          <div className="status-page-settings-cta-container">
            <Button type={Button.TYPE.PRIMARY}>Done</Button>
            <Button type={Button.TYPE.DESTRUCTIVE}>Delete</Button>
          </div>
        </div>
      </div>
    );
  }
}
