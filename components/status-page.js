import React from 'react';
import PropTypes from 'prop-types';
import Summary from './summary';
import 'web-animations-js';

import Network from '../utilities/network';
import CurrentIncidents from './current-incidents';
import FormatService from '../utilities/format-service';
import {
  Spinner,
  Button,
  Icon,
  TextField,
  Dropdown,
  DropdownItem,
  navigation,
} from 'nr1';
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
      settingsViewActive: false,
      settingsPopoverActive: false,
    };

    this.handleTileSettingsAnimation = this.handleTileSettingsAnimation.bind(
      this
    );
    this.handleSettingsPopover = this.handleSettingsPopover.bind(this);
    this.handleEditButtonClick = this.handleEditButtonClick.bind(this);

    this.serviceTilePrimaryContent = React.createRef();
    this.serviceTileSettingsContent = React.createRef();
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

  handleTileSettingsAnimation() {
    const { settingsViewActive } = this.state;
    const primaryContent = this.serviceTilePrimaryContent.current;
    const settingsContent = this.serviceTileSettingsContent.current;

    if (settingsViewActive) {
      const animateSettingsOut = settingsContent.animate(
        {
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

      const animatePrimaryContentIn = primaryContent.animate(
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
      this.setState({ settingsViewActive: false });
    } else {
      const animateSettingsIn = settingsContent.animate(
        {
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

      animatePrimaryContentOut.onfinish = () => {
        this.setState({ settingsViewActive: true });
      };
    }
  }

  handleTileClick(statusPageIoSummaryData, refreshRate, hostname, provider, i) {
    if (i !== undefined) {
      navigation.openStackedNerdlet({
        id: 'service-details',
        urlState: {
          statusPageIoSummaryData: statusPageIoSummaryData,
          refreshRate: refreshRate,
          hostname: hostname,
          provider: provider,
          timelineItemIndex: i,
        },
      });
      event.stopPropagation();
    } else {
      navigation.openStackedNerdlet({
        id: 'service-details',
        urlState: {
          statusPageIoSummaryData: statusPageIoSummaryData,
          refreshRate: refreshRate,
          hostname: hostname,
          provider: provider,
        },
      });
    }
  }

  handleSettingsPopover(e) {
    this.setState({ settingsPopoverActive: !this.state.settingsPopoverActive });
    e.stopPropagation();
  }

  handleEditButtonClick(e) {
    e.stopPropagation();
    this.handleTileSettingsAnimation();
    this.handleSettingsPopover();
  }

  handleDeleteButtonClick(e) {
    this.props.handleDeleteTileModal()();
    e.stopPropagation();
    this.handleSettingsPopover();
  }

  render() {
    const { statusPageIoSummaryData, inputValue, value } = this.state;
    if (!statusPageIoSummaryData) return <Spinner fillContainer />;

    const {
      provider,
      refreshRate,
      hostname,
      handleDeleteTileModal,
    } = this.props;
    const { settingsViewActive } = this.state;

    return (
      <div
        className={`status-page-container status-${
          statusPageIoSummaryData.indicator
        } ${
          settingsViewActive ? 'settings-view-active' : 'settings-view-inactive'
        }`}
      >
        <div
          className="primary-status-page-content"
          ref={this.serviceTilePrimaryContent}
          onClick={() =>
            this.handleTileClick(
              statusPageIoSummaryData,
              refreshRate,
              hostname,
              provider
            )
          }
        >
          <div className="logo-container">
            <div
              className={`service-settings-button-container ${
                this.state.settingsPopoverActive
                  ? 'settings-popover-active'
                  : 'settings-popover-inactive'
              }`}
            >
              <Button
                sizeType={Button.SIZE_TYPE.SMALL}
                className="service-settings-button"
                type={Button.TYPE.NORMAL}
                iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__MORE}
                onClick={this.handleSettingsPopover}
              />
              <ul className="service-settings-dropdown">
                <li className="service-settings-dropdown-item">
                  <Icon type={Icon.TYPE.INTERFACE__INFO__INFO} />
                  View details
                </li>
                <li
                  className="service-settings-dropdown-item"
                  onClick={this.handleEditButtonClick}
                >
                  <Icon type={Icon.TYPE.INTERFACE__OPERATIONS__EDIT} />
                  Edit
                </li>
                <li
                  className="service-settings-dropdown-item destructive"
                  onClick={() => this.handleDeleteButtonClick()}
                >
                  <Icon
                    type={Icon.TYPE.INTERFACE__OPERATIONS__TRASH}
                    color="#BF0016"
                  />
                  Delete
                </li>
              </ul>
            </div>

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
            handleTileClick={i => {
              this.handleTileClick(
                statusPageIoSummaryData,
                refreshRate,
                hostname,
                provider,
                i
              );
            }}
          />
        </div>
        <div
          className="status-page-settings-container"
          ref={this.serviceTileSettingsContent}
        >
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
            <Dropdown
              title="Choose a provider"
              label="Provider"
              className="status-page-setting"
            >
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
            <Button
              type={Button.TYPE.PRIMARY}
              onClick={this.handleTileSettingsAnimation}
            >
              Done
            </Button>
            <Button
              type={Button.TYPE.DESTRUCTIVE}
              onClick={e => this.handleDeleteButtonClick(e)}
              iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__TRASH}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
