import React from 'react';
import PropTypes from 'prop-types';
import StatusPage from '../../components/status-page';

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
import CreatableSelect from 'react-select/creatable';
import Toolbar from '../../components/toolbar';
import { getHostNamesFromNerdStorage } from '../../utilities/nerdlet-storage';

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
    };
    this.onAccountSelected = this.onAccountSelected.bind(this);
    this.onRefreshRateSelected = this.onRefreshRateSelected.bind(this);
    this.setHostNames = this.setHostNames.bind(this);
    this.handleDeleteTileModal = this.handleDeleteTileModal.bind(this);
    this.handleCreateTileModal = this.handleCreateTileModal.bind(this);
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
    this._interval = setInterval(this.pollHosts.bind(this), 15000);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  setHostNames(hostNames) {
    this.setState({ hostNames });
  }

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

  async onAccountSelected(accountId, accounts) {
    this.setState({ selectedAccountId: accountId, accounts });

    const hostNames = await getHostNamesFromNerdStorage({
      key: accountId,
      type: 'account',
    });
    this.setHostNames(hostNames);
  }

  //! This is a hack until there is an message bus between stacked nerdlets
  async pollHosts() {
    try {
      const hostNames = await getHostNamesFromNerdStorage({
        key: this.state.entityGuid
          ? this.state.entityGuid
          : this.state.selectedAccountId,
        type: this.state.entityGuid ? 'entity' : 'account',
      });
      if (JSON.stringify(hostNames) !== JSON.stringify(this.state.hostNames)) {
        this.setHostNames(hostNames);
      }
    } catch (err) {
      console.log(err);
    }
  }

  onRefreshRateSelected(event) {
    this.setState({ refreshRate: parseInt(event.currentTarget.text) });
  }

  getGridItems() {
    if (
      !this.state.hostNames ||
      (!this.state.selectedAccountId && !this.state.entityGuid)
    ) {
      return (
        <GridItem className="no-status-pages" columnStart={1} columnEnd={12}>
          <Spinner fillContainer />
        </GridItem>
      );
    }
    if (this.state.hostNames.length === 0) {
      return (
        <GridItem className="no-status-pages" columnStart={1} columnEnd={12}>
          <HeadingText
            className="suggested-status-page-title"
            type={HeadingText.TYPE.HEADING_1}
          >
            No Status Pages are configured
          </HeadingText>
        </GridItem>
      );
    }
    return this.state.hostNames.map(hostname => (
      <GridItem
        className="status-page-grid-item"
        key={hostname.id}
        columnSpan={3}
      >
        <StatusPage
          refreshRate={this.state.refreshRate}
          hostname={hostname.hostName}
          provider={hostname.provider}
          handleDeleteTileModal={() => this.handleDeleteTileModal}
        />
      </GridItem>
    ));
  }

  handleDeleteTileModal() {
    this.setState({ deleteTileModalActive: !this.state.deleteTileModalActive });
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
          refreshRateCallback={this.onRefreshRateSelected}
          refreshRate={refreshRate}
          onAccountSelected={this.onAccountSelected}
          selectedAccountId={selectedAccountId}
          hostNames={hostNames}
          hostNameCallBack={this.setHostNames}
          pollHostCallBack={this.pollHosts}
          handleCreateTileModal={this.handleCreateTileModal}
        />
        <Grid
          className="status-container"
          spacingType={[Grid.SPACING_TYPE.SMALL, Grid.SPACING_TYPE.EXTRA_LARGE]}
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
            onClick={this.handleTileSettingsAnimation}
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
            Provide the information needed to determine the status of this
            service. You will be able to edit this information in the future.
          </p>

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

          <TextField
            label="Service logo"
            className="status-page-setting"
          ></TextField>

          <Button
            type={Button.TYPE.Secondary}
            onClick={() => this.setState({ createTileModalActive: false })}
          >
            Cancel
          </Button>
          <Button
            type={Button.TYPE.PRIMARY}
            onClick={() => this.setState({ createTileModalActive: false })}
          >
            Add new serivce
          </Button>
        </Modal>
      </div>
      // </AccountsContext.Provider>
    );
  }
}
