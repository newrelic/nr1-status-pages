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
    hostname: PropTypes.object.isRequired,
    refreshRate: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.StatusPageNetwork = new Network(
      this.props.hostname.hostName,
      this.props.refreshRate,
      this.props.hostname.provider
    );
    this.FormatService = new FormatService(this.props.hostname.provider);
    this.popupHoverTimer = null;

    this.state = {
      statusPageIoSummaryData: undefined,
      inputValue: '',
      value: [],
      settingsViewActive: false,
      settingsPopoverActive: false,
      editedServiceName: this.props.hostname.serviceName,
      editedHostName: this.props.hostname.hostName,
      editedHostProvider: this.props.hostname.provider,
      editedHostLogo: this.props.hostname.hostLogo,
    };

    this.handleTileSettingsAnimation = this.handleTileSettingsAnimation.bind(
      this
    );
    this.handleSettingsPopover = this.handleSettingsPopover.bind(this);
    this.handleEditButtonClick = this.handleEditButtonClick.bind(this);
    this.handleSettingsButtonMouseLeave = this.handleSettingsButtonMouseLeave.bind(
      this
    );
    this.handlePopupMouseEnter = this.handlePopupMouseEnter.bind(this);
    this.handlePopupMouseLeave = this.handlePopupMouseLeave.bind(this);

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

  autoSetLogo(hostname) {
    const { serviceName, hostName, provider, hostLogo } = hostname;
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
    } else if (hostLogo !== undefined && hostLogo !== '') {
      return (
        <img
          src={hostLogo}
          className="service-logo"
          alt={`${serviceName} logo`}
        />
      );
    } else {
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
    if (!event.target.closest('.destructive')) {
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

  handleDeleteButtonClick(hostname, e) {
    this.props.handleDeleteTileModal()(hostname);
    e.stopPropagation();
    this.handleSettingsPopover();
  }

  handleSaveButtonClick(e, hostname) {
    const hostNameObject = {
      serviceName: this.state.editedServiceName,
      hostName: this.state.editedHostName,
      provider: this.state.editedHostProvider,
      hostLogo: this.state.editedHostLogo,
    };

    this.props.editHostName()(hostNameObject);
    e.stopPropagation();
    this.handleTileSettingsAnimation();
  }

  handleSettingsButtonMouseLeave() {
    this.popupHoverTimer = setTimeout(() => {
      this.setState({ settingsPopoverActive: false });
    }, 150);
  }

  handlePopupMouseEnter() {
    if (this.popupHoverTimer) {
      clearTimeout(this.popupHoverTimer);
    }
  }

  handlePopupMouseLeave() {
    this.popupHoverTimer = setTimeout(() => {
      this.setState({ settingsPopoverActive: false });
    }, 150);
  }

  renderSettingsButton() {
    const hostname = this.props.hostname;
    return (
      <div
        className={`service-settings-button-container ${
          this.state.settingsPopoverActive
            ? 'settings-popover-active'
            : 'settings-popover-inactive'
        }`}
        onMouseLeave={this.handleSettingsButtonMouseLeave}
      >
        <Button
          sizeType={Button.SIZE_TYPE.SMALL}
          className="service-settings-button"
          type={Button.TYPE.NORMAL}
          iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__MORE}
          onClick={this.handleSettingsPopover}
        />
        <ul
          className="service-settings-dropdown"
          onMouseEnter={this.handlePopupMouseEnter}
          onMouseLeave={this.handlePopupMouseLeave}
        >
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
            onClick={() => this.handleDeleteButtonClick(hostname, event)}
          >
            <Icon
              type={Icon.TYPE.INTERFACE__OPERATIONS__TRASH}
              color="#BF0016"
            />
            Delete
          </li>
        </ul>
      </div>
    );
  }

  renderSettings() {
    const hostname = this.props.hostname;
    return (
      <div
        className="status-page-settings-container"
        ref={this.serviceTileSettingsContent}
      >
        <div className="status-page-settings-content">
          <TextField
            label="Service name"
            className="status-page-setting"
            onChange={() =>
              this.setState(previousState => ({
                ...previousState,
                editedServiceName: event.target.value,
              }))
            }
            defaultValue={hostname.serviceName}
          ></TextField>
          <TextField
            label="Hostname"
            placeholder="https://status.myservice.com/"
            className="status-page-setting"
            onChange={() =>
              this.setState(previousState => ({
                ...previousState,
                editedHostName: event.target.value,
              }))
            }
            defaultValue={hostname.hostName}
          ></TextField>
          <Dropdown
            title="Choose a provider"
            label="Provider"
            className="status-page-setting"
          >
            <DropdownItem
              selected
              onClick={() =>
                this.setState(previousState => ({
                  ...previousState,
                  editedHostProvider: event.target.innerHTML,
                }))
              }
            >
              Status Page
            </DropdownItem>
            <DropdownItem
              onClick={() =>
                this.setState(previousState => ({
                  ...previousState,
                  editedHostProvider: event.target.innerHTML,
                }))
              }
            >
              Google
            </DropdownItem>
            <DropdownItem
              onClick={() =>
                this.setState(previousState => ({
                  ...previousState,
                  editedHostProvider: event.target.innerHTML,
                }))
              }
            >
              Status Io
            </DropdownItem>
          </Dropdown>
          <TextField
            label="Service logo"
            className="status-page-setting"
            onChange={() =>
              this.setState(previousState => ({
                ...previousState,
                editedHostLogo: event.target.value,
              }))
            }
            defaultValue={hostname.hostLogo}
            placeholder="https://website.com/logo.png"
          ></TextField>
        </div>
        <div className="status-page-settings-cta-container">
          <Button
            type={Button.TYPE.DESTRUCTIVE}
            onClick={e => this.handleDeleteButtonClick(hostname, e)}
            iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__TRASH}
          >
            Delete
          </Button>
          <Button
            type={Button.TYPE.PRIMARY}
            onClick={e => this.handleSaveButtonClick(e, hostname.hostName)}
          >
            Done
          </Button>
        </div>
      </div>
    );
  }

  renderLoadingState() {
    const { settingsViewActive } = this.state;
    return (
      <div
        className={`status-page-container ${
          settingsViewActive ? 'settings-view-active' : 'settings-view-inactive'
        }`}
      >
        {this.renderSettingsButton()}
        <Spinner fillContainer />
        <div ref={this.serviceTilePrimaryContent}></div>
        {this.renderSettings()}
      </div>
    );
  }

  render() {
    const { statusPageIoSummaryData, inputValue, value } = this.state;
    if (!statusPageIoSummaryData) {
      return this.renderLoadingState();
    }

    const {
      refreshRate,
      hostname,
      handleDeleteTileModal,
      editHostName,
      hostnameGeneric,
    } = this.props;

    console.log(hostnameGeneric);

    const { settingsViewActive } = this.state;

    return (
      <div
        className={`status-page-container status-${
          statusPageIoSummaryData.indicator
        } ${
          settingsViewActive ? 'settings-view-active' : 'settings-view-inactive'
        }`}
        ref={this.props.setServiceTileRef}
      >
        <div
          className="primary-status-page-content"
          ref={this.serviceTilePrimaryContent}
          onClick={() =>
            this.handleTileClick(
              statusPageIoSummaryData,
              refreshRate,
              hostname.hostName,
              hostname.provider
            )
          }
        >
          <div className="logo-container">
            {this.renderSettingsButton(hostname)}

            {this.autoSetLogo(hostname)}
          </div>
          <div className="service-current-status">
            <h5 className="service-current-status-heading">
              {statusPageIoSummaryData.indicator === 'none' && (
                <Icon type={Icon.TYPE.INTERFACE__SIGN__CHECKMARK} />
              )}
              {statusPageIoSummaryData.indicator === 'minor' && (
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0)">
                    <path
                      d="M8.14625 3.05583L1.44083 14.25C1.30258 14.4894 1.22943 14.7609 1.22866 15.0373C1.22789 15.3138 1.29951 15.5856 1.43642 15.8258C1.57333 16.066 1.77074 16.2662 2.00902 16.4064C2.2473 16.5466 2.51813 16.622 2.79458 16.625H16.2054C16.4819 16.622 16.7527 16.5466 16.991 16.4064C17.2293 16.2662 17.4267 16.066 17.5636 15.8258C17.7005 15.5856 17.7721 15.3138 17.7713 15.0373C17.7706 14.7609 17.6974 14.4894 17.5592 14.25L10.8538 3.05583C10.7126 2.82316 10.5139 2.6308 10.2768 2.49729C10.0397 2.36379 9.77213 2.29366 9.5 2.29366C9.22788 2.29366 8.96035 2.36379 8.72322 2.49729C8.4861 2.6308 8.28738 2.82316 8.14625 3.05583V3.05583Z"
                      stroke="#733E00"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.5 7.125V10.2917"
                      stroke="#733E00"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.5 13.4583V13.7083"
                      stroke="#733E00"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <rect width="19" height="19" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              )}
              {statusPageIoSummaryData.indicator === 'major' && (
                <Icon type={Icon.TYPE.INTERFACE__SIGN__CLOSE} />
              )}
              {statusPageIoSummaryData.indicator === 'critical' && (
                <Icon type={Icon.TYPE.INTERFACE__SIGN__CLOSE} />
              )}
              {statusPageIoSummaryData.description}
            </h5>
          </div>
          <CurrentIncidents
            refreshRate={refreshRate}
            hostname={hostname.hostName}
            provider={hostname.provider}
            handleTileClick={i => {
              this.handleTileClick(
                statusPageIoSummaryData,
                refreshRate,
                hostname.hostName,
                hostname.provider,
                i
              );
            }}
          />
        </div>
        {this.renderSettings()}
      </div>
    );
  }
}
