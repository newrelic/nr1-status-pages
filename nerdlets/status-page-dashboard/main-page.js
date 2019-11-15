import React from 'react';
import PropTypes from 'prop-types';
import StatusPage from '../../components/status-page';
import { popularSites } from '../../popular-status-pages';

import {
  HeadingText,
  Grid,
  GridItem,
  Spinner,
  Modal,
  Button,
  TextField,
  Dropdown,
  DropdownItem,
} from 'nr1';
const uuid = require('uuid/v4');
import Toolbar from '../../components/toolbar';
import AccountPicker from '../../components/account-picker';
import {
  getHostNamesFromNerdStorage,
  saveHostNamesToNerdStorage,
} from '../../utilities/nerdlet-storage';

const createOption = label => ({
  label,
  value: label,
});
export default class StatusPagesDashboard extends React.Component {
  static propTypes = {
    entityGuid: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      entityGuid: props.entityGuid ? props.entityGuid : null,
      suggestedDependencies: [],
      selectedAccountId: undefined,
      hostNames: [],
      refreshRate: 15,
      deleteTileModalActive: false,
      createTileModalActive: false,
      inputValue: '',
      value: [],
      newServiceName: '',
      newHostName: '',
      newHostProvider: '',
      newHostLogo: '',
      searchQuery: '',
      quickSetupSelection: '',
      keyObject: {
        key: props.entityGuid,
        type: props.entityGuid ? 'entity' : 'account',
      },
      requestForHostnamesMade: false,
    };

    this.newHostNameInput = React.createRef();

    this.onAccountSelected = this.onAccountSelected.bind(this);
    this.setHostNames = this.setHostNames.bind(this);
    this.handleDeleteTileModal = this.handleDeleteTileModal.bind(this);
    this.handleCreateTileModal = this.handleCreateTileModal.bind(this);
    this.addHostName = this.addHostName.bind(this);
    this.handleAddNewService = this.handleAddNewService.bind(this);
    this.deleteHostName = this.deleteHostName.bind(this);
    this.editHostName = this.editHostName.bind(this);
    this.setSearchQuery = this.setSearchQuery.bind(this);
  }

  async componentDidMount() {
    const { entityGuid } = this.state;
    if (entityGuid) {
      const hostNames = await getHostNamesFromNerdStorage({
        key: entityGuid,
        type: 'entity',
      });
      this.setHostNames(hostNames);
    }
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  async save() {
    const { keyObject, hostNames } = this.state;
    await saveHostNamesToNerdStorage(keyObject, hostNames);
  }

  handleAddNewService() {
    const hostNameObject = {
      id: uuid(),
      serviceName: this.state.newServiceName,
      hostName: this.state.newHostName,
      provider: this.state.newHostProvider,
      hostLogo: this.state.newHostLogo,
    };

    this.addHostName(hostNameObject);

    this.setState({
      newServiceName: '',
      newHostName: '',
      newHostProvider: '',
      newHostLogo: '',
    });
  }

  async addHostName(hostNameObject) {
    const { hostNames } = this.state;
    hostNames.push(hostNameObject);
    this.setState({ hostNames }, async () => {
      await this.save();
    });

    this.setState({ createTileModalActive: false });
  }

  async deleteHostName() {
    const hostNameText = this.state.tileToBeDeleted;
    const { hostNames } = this.state;
    hostNames.splice(
      hostNames.findIndex(val => val.hostName === hostNameText),
      1
    );
    this.setState({
      hostNames: hostNames,
      deleteTileModalActive: !this.state.deleteTileModalActive,
    });
    await this.save();
  }

  async editHostName(hostnameObject) {
    const { hostNames } = this.state;
    const { serviceName, hostName, provider, hostLogo } = hostnameObject;
    const indexOfEditedHostname = hostNames.findIndex(
      val => val.hostName === hostName
    );

    let newHostnameObject = hostnameObject;
    newHostnameObject.id = hostNames[indexOfEditedHostname].id;
    hostNames[indexOfEditedHostname] = newHostnameObject;

    this.setState({ hostNames: hostNames });
    await this.save();
  }

  setHostNames(hostNames) {
    this.setState({ hostNames, requestForHostnamesMade: true });
  }

  handleSelectInputChange = inputValue => {
    this.setState({ inputValue });
  };

  handleQuickSetupSelect(e) {
    const selectedService = e.target.innerHTML;
    let indexOfPopularSite = null;

    switch (selectedService) {
      case 'Google Cloud':
        indexOfPopularSite = 0;
        break;
      case 'New Relic':
        indexOfPopularSite = 1;
        break;
      case 'Jira':
        indexOfPopularSite = 2;
        break;
      case 'GitHub':
        indexOfPopularSite = 3;
        break;
      case 'Ezidebit':
        indexOfPopularSite = 4;
        break;
    }
    const selectedPopularSite = popularSites.sites[indexOfPopularSite];

    this.setState({
      newServiceName: selectedPopularSite.serviceName,
      newHostName: selectedPopularSite.hostName,
      newHostProvider: selectedPopularSite.provider,
      newHostLogo: selectedPopularSite.hostLogo,
      quickSetupSelection: selectedService,
    });
  }

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

  async onAccountSelected(accountId, accounts) {
    if (!this.state.entityGuid) {
      const keyObject = Object.assign({}, this.state.keyObject, {
        key: accountId,
      });

      this.setState({
        selectedAccountId: accountId,
        accounts,
        keyObject,
      });

      const hostNames = await getHostNamesFromNerdStorage({
        key: accountId,
        type: 'account',
      });
      this.setHostNames(hostNames);
    }
  }

  // //! This is a hack until there is an message bus between stacked nerdlets
  // async pollHosts() {
  //   try {
  //     const hostNames = await getHostNamesFromNerdStorage({
  //       key: this.state.entityGuid
  //         ? this.state.entityGuid
  //         : this.state.selectedAccountId,
  //       type: this.state.entityGuid ? 'entity' : 'account',
  //     });
  //     if (JSON.stringify(hostNames) !== JSON.stringify(this.state.hostNames)) {
  //       this.setHostNames(hostNames);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  setSearchQuery(e) {
    this.setState({ searchQuery: event.target.value });
  }

  getGridItems() {
    let {
      searchQuery,
      hostNames,
      requestForHostnamesMade,
      keyObject,
      entityGuid,
    } = this.state;

    const entityGuidExists = entityGuid !== null && entityGuid !== undefined;

    if (!requestForHostnamesMade) {
      return (
        <GridItem columnStart={1} columnEnd={12}>
          <Spinner fillContainer />
        </GridItem>
      );
    }

    if (hostNames.length === 0) {
      return (
        <GridItem className="no-status-pages" columnStart={5} columnEnd={8}>
          <HeadingText
            className="no-status-pages-header"
            type={HeadingText.TYPE.HEADING_2}
          >
            Get started
          </HeadingText>

          <p className="no-status-pages-description">
            {!entityGuidExists &&
              'Select an account below to get started. Then,'}
            {entityGuidExists && 'To get started,'} click the "Add a new
            service" button below to add it to the list of services who's
            statuses you can view and track on this page.
          </p>

          {!entityGuidExists && (
            <AccountPicker accountChangedCallback={this.onAccountSelected} />
          )}

          <Button
            type={Button.TYPE.PRIMARY}
            iconType={Button.ICON_TYPE.INTERFACE__SIGN__PLUS}
            sizeType={Button.SIZE_TYPE.LARGE}
            onClick={this.handleCreateTileModal}
          >
            Add new service
          </Button>
        </GridItem>
      );
    }

    let currentHostnames = hostNames;

    if (searchQuery !== '' && searchQuery !== undefined) {
      currentHostnames = hostNames.filter(hostname => {
        if (!hostname.serviceName) {
          return hostname.hostName
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        }
        return hostname.serviceName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });
    }

    return currentHostnames.map(hostname => (
      <GridItem
        className="status-page-grid-item"
        key={hostname.id}
        columnSpan={3}
      >
        <StatusPage
          refreshRate={this.state.refreshRate}
          hostname={hostname}
          handleDeleteTileModal={() => this.handleDeleteTileModal}
          editHostName={() => this.editHostName}
          setSearchQuery={() => this.setSearchQuery}
          keyObject={keyObject}
        />
      </GridItem>
    ));
  }

  handleDeleteTileModal(hostname) {
    this.setState({
      deleteTileModalActive: !this.state.deleteTileModalActive,
      tileToBeDeleted: hostname.hostName,
    });
  }

  handleCreateTileModal() {
    this.setState({ createTileModalActive: !this.state.createTileModalActive });
  }

  render() {
    const {
      accounts,
      entityGuid,
      hostNames,
      refreshRate,
      selectedAccountId,
      deleteTileModalActive,
      createTileModalActive,
      inputValue,
      value,
    } = this.state;

    return (
      // <AccountsContext.Provider value={this.state}>
      <div>
        <Toolbar
          accounts={accounts}
          entityGuid={entityGuid}
          onAccountSelected={this.onAccountSelected}
          selectedAccountId={selectedAccountId}
          hostNames={hostNames}
          hostNameCallBack={this.setHostNames}
          handleCreateTileModal={this.handleCreateTileModal}
          setSearchQuery={() => this.setSearchQuery}
        />
        <Grid
          className={`status-container ${
            hostNames.length === 0 ? 'no-status-pages-found' : ''
          }`}
          spacingType={[Grid.SPACING_TYPE.SMALL, Grid.SPACING_TYPE.EXTRA_LARGE]}
          fullHeight
        >
          {this.getGridItems()}
        </Grid>
        <Modal
          hidden={!deleteTileModalActive}
          onClose={() => this.setState({ deleteTileModalActive: false })}
        >
          <HeadingText type={HeadingText.TYPE.HEADING_2}>
            Are you sure you want to delete this service?
          </HeadingText>
          <p>
            This cannot be undone. Please confirm whether or not you want to
            delete this service from your status pages.
          </p>

          <Button
            type={Button.TYPE.PRIMARY}
            onClick={() => this.setState({ deleteTileModalActive: false })}
          >
            Cancel
          </Button>
          <Button
            type={Button.TYPE.DESTRUCTIVE}
            onClick={this.deleteHostName}
            iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__TRASH}
          >
            Delete
          </Button>
        </Modal>

        <Modal
          hidden={!createTileModalActive}
          onClose={() => this.setState({ createTileModalActive: false })}
        >
          <HeadingText type={HeadingText.TYPE.HEADING_2}>
            Add new service
          </HeadingText>
          <p>
            Select a common services from the "quick setup" dropdown below, or
            provide the information needed to determine the status of the
            service you'd like to add. You will be able to edit this information
            in the future.
          </p>

          <Dropdown
            title={
              this.state.newHostProvider === ''
                ? 'Choose a service'
                : this.state.quickSetupSelection
            }
            label="Quick setup"
            className="status-page-setting"
          >
            <DropdownItem onClick={() => this.handleQuickSetupSelect(event)}>
              Google Cloud
            </DropdownItem>
            <DropdownItem onClick={() => this.handleQuickSetupSelect(event)}>
              GitHub
            </DropdownItem>
            <DropdownItem onClick={() => this.handleQuickSetupSelect(event)}>
              Jira
            </DropdownItem>
            <DropdownItem onClick={() => this.handleQuickSetupSelect(event)}>
              New Relic
            </DropdownItem>
            <DropdownItem onClick={() => this.handleQuickSetupSelect(event)}>
              Ezidebit
            </DropdownItem>
          </Dropdown>

          <hr className="or-sep" />

          <TextField
            label="Service name"
            className="status-page-setting"
            onChange={() =>
              this.setState(previousState => ({
                ...previousState,
                newServiceName: event.target.value,
              }))
            }
            value={this.state.newServiceName}
          ></TextField>
          <TextField
            label="Hostname"
            placeholder="https://status.myservice.com/"
            className="status-page-setting"
            onChange={() =>
              this.setState(previousState => ({
                ...previousState,
                newHostName: event.target.value,
              }))
            }
            value={this.state.newHostName}
          ></TextField>
          <Dropdown
            title={
              this.state.newHostProvider === ''
                ? 'Choose a provider'
                : this.state.newHostProvider
            }
            label="Provider"
            className="status-page-setting"
          >
            <DropdownItem
              selected
              onClick={() =>
                this.setState(previousState => ({
                  ...previousState,
                  newHostProvider: event.target.innerHTML,
                }))
              }
            >
              Status Page
            </DropdownItem>
            <DropdownItem
              onClick={() =>
                this.setState(previousState => ({
                  ...previousState,
                  newHostProvider: event.target.innerHTML,
                }))
              }
            >
              Google
            </DropdownItem>
            <DropdownItem
              onClick={() =>
                this.setState(previousState => ({
                  ...previousState,
                  newHostProvider: event.target.innerHTML,
                }))
              }
            >
              Status Io
            </DropdownItem>
          </Dropdown>

          <TextField
            label="Service logo (url)"
            className="status-page-setting"
            onChange={() =>
              this.setState(previousState => ({
                ...previousState,
                newHostLogo: event.target.value,
              }))
            }
            value={this.state.newHostLogo}
            placeholder="https://myservice.com/logo.png"
          ></TextField>

          <Button
            type={Button.TYPE.Secondary}
            onClick={() => this.setState({ createTileModalActive: false })}
          >
            Cancel
          </Button>
          <Button type={Button.TYPE.PRIMARY} onClick={this.handleAddNewService}>
            Add new serivce
          </Button>
        </Modal>
      </div>
    );
  }
}
