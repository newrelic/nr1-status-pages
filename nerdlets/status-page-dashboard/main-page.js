import React from 'react';
import PropTypes from 'prop-types';
import StatusPage from '../../components/status-page';

import { HeadingText, Grid, GridItem, Spinner, Modal, Button } from 'nr1';
import Toolbar from '../../components/toolbar';
import { getHostNamesFromNerdStorage } from '../../utilities/nerdlet-storage';

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
    };
    this.onAccountSelected = this.onAccountSelected.bind(this);
    this.onRefreshRateSelected = this.onRefreshRateSelected.bind(this);
    this.setHostNames = this.setHostNames.bind(this);
    this.handleDeleteTileModal = this.handleDeleteTileModal.bind(this);
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

  render() {
    const {
      accounts,
      entityGuid,
      hostNames,
      refreshRate,
      selectedAccountId,
      deleteTileModalActive,
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
      </div>
      // </AccountsContext.Provider>
    );
  }
}
