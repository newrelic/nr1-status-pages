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
  Checkbox
} from 'nr1';
import Toolbar from '../../components/toolbar';
import AccountPicker from '../../components/account-picker';
import {
  getHostNamesFromNerdStorage,
  saveHostNamesToNerdStorage
} from '../../utilities/nerdlet-storage';
import TextFieldWrapper from './TextFieldWrapper/TextFieldWrapper';

const uuid = require('uuid/v4');

const createOption = label => ({
  label,
  value: label
});

const PROVIDERS = {
  STATUS_PAGE: {
    value: 'statusPageIo',
    label: 'Status Page'
  },
  GOOGLE: {
    value: 'google',
    label: 'Google'
  },
  STATUS_IO: {
    value: 'statusIo',
    label: 'Status Io'
  },
  NRQL: {
    value: 'nrql',
    label: 'NRQL'
  },
  RSS: {
    value: 'rss',
    label: 'RSS Feed'
  }
};

const emptyInputState = {
  inputValue: '',
  validationText: ''
};

export default class StatusPagesDashboard extends React.PureComponent {
  static propTypes = {
    entityGuid: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      entityGuid: props.entityGuid ? props.entityGuid : null,
      selectedAccountId: undefined,
      hostNames: [],
      refreshRate: 15,
      deleteTileModalActive: false,
      createTileModalActive: false,
      inputValue: '',
      value: [],
      selectedPopularSiteIndex: '',
      hostRequiresProxy: false,
      formInputs: {
        serviceName: { ...emptyInputState },
        hostName: { ...emptyInputState },
        providerName: { ...emptyInputState },
        logoUrl: { ...emptyInputState }
      },
      searchQuery: '',
      keyObject: {
        key: props.entityGuid,
        type: props.entityGuid ? 'entity' : 'account'
      },
      requestForHostnamesMade: false
    };

    this.newHostNameInput = React.createRef();
  }

  async componentDidMount() {
    const { entityGuid } = this.state;
    if (entityGuid) {
      const hostNames = await getHostNamesFromNerdStorage({
        key: entityGuid,
        type: 'entity'
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

  clearFormInputs = () => {
    const { formInputs } = this.state;
    const updatedInputs = { ...formInputs };
    Object.keys(updatedInputs).forEach(inputName => {
      updatedInputs[inputName] = { ...emptyInputState };
    });

    delete updatedInputs.nrqlQuery;
    updatedInputs.hostName = { ...emptyInputState };

    this.setState({ formInputs: updatedInputs, selectedPopularSiteIndex: '' });
  };

  validateFormAndReturnStatus = () => {
    const { formInputs } = this.state;
    const updatedFormInputs = { ...formInputs };
    const inputsList = Object.keys(formInputs).filter(k => k!=="logoUrl");
    const genericValidationError = 'Please fill this field before saving.';
    let isFormValid = true;

    for (const inputName of inputsList) {
      if (formInputs[inputName].inputValue.length < 2) {
        updatedFormInputs[inputName].validationText = genericValidationError;
        isFormValid = false;
      } else {
        updatedFormInputs[inputName].validationText = '';
      }
    }

    const {
      corsProxyAddress,
      nrqlQuery,
      providerName,
      hostName
    } = updatedFormInputs;

    if (corsProxyAddress && corsProxyAddress.inputValue) {
      if (!corsProxyAddress.inputValue.includes('{url}')) {
        corsProxyAddress.validationText =
          "CORS address must contain '{url}' that will be replaced with hostname";
      }
    }

    if (nrqlQuery && nrqlQuery.inputValue) {
      const formatRegexp = new RegExp(
        /^((?=.*SELECT.*FROM)|(?=.*FROM.*SELECT)).*$/i
      );

      const fieldsRegexp = new RegExp(
        /^.*(?=.*EventName)(?=.*EventStatus)(?=.*EventTimeStamp).*$/
      );

      if (!formatRegexp.test(nrqlQuery.inputValue)) {
        isFormValid = false;
        nrqlQuery.validationText = 'Provided value is not correct NRQL query';
      } else if (!fieldsRegexp.test(nrqlQuery.inputValue)) {
        isFormValid = false;
        nrqlQuery.validationText =
          'Query must contain following fields/aliases: EventName, EventStatus and EventTimeStamp';
      }
    }

    if (providerName.inputValue === 'statusIo') {
      const regExp = new RegExp(/\/pages\/history\/[a-z0-9]+$/g);
      if (!regExp.test(hostName.inputValue)) {
        isFormValid = false;
        hostName.validationText =
          'Please provide a valid StatusIO URL according to the documentation';
      }
    }

    this.setState({ formInputs: updatedFormInputs });
    return isFormValid;
  };

  handleAddNewService = async () => {
    if (this.validateFormAndReturnStatus() === false) return;

    const { formInputs, hostRequiresProxy } = this.state;
    const {
      serviceName,
      hostName,
      providerName,
      logoUrl,
      nrqlQuery,
      corsProxyAddress
    } = formInputs;

    let formattedHostName;
    if (providerName.inputValue !== PROVIDERS.NRQL.value) {
      formattedHostName = hostRequiresProxy
        ? corsProxyAddress.inputValue.replace('{url}', hostName?.inputValue)
        : hostName?.inputValue;

      formattedHostName = encodeURI(formattedHostName);
    }

    const hostNameObject = {
      id: uuid(),
      serviceName: serviceName.inputValue,
      hostName: formattedHostName,
      provider: providerName.inputValue,
      hostLogo: logoUrl.inputValue,
      nrqlQuery: nrqlQuery?.inputValue
    };

    await this.addHostName(hostNameObject);
    this.clearFormInputs();
  };

  addHostName = async hostNameObject => {
    const { hostNames } = this.state;
    hostNames.push(hostNameObject);
    this.setState({ hostNames }, async () => {
      await this.save();
    });
    this.setState({ createTileModalActive: false });
  };

  deleteHostName = async () => {
    const hostNameText = this.state.tileToBeDeleted;
    const { hostNames } = this.state;
    hostNames.splice(
      hostNames.findIndex(val => val.hostName === hostNameText),
      1
    );
    const { deleteTileModalActive } = this.state;
    this.setState({
      hostNames: hostNames,
      deleteTileModalActive: !deleteTileModalActive
    });
    await this.save();
  };

  editHostName = async hostnameObject => {
    const { hostNames } = this.state;
    const { id } = hostnameObject;
    const indexOfEditedHostname = hostNames.findIndex(val => val.id === id);

    const newHostnameObject = hostnameObject;
    newHostnameObject.id = hostNames[indexOfEditedHostname].id;
    hostNames[indexOfEditedHostname] = newHostnameObject;

    this.setState({ hostNames: hostNames });
    await this.save();
  };

  setHostNames = hostNames => {
    this.setState({ hostNames, requestForHostnamesMade: true });
  };

  handleQuickSetupSelect(e) {
    const indexOfPopularSite = e.target.value;
    if (indexOfPopularSite === '') {
      this.clearFormInputs();
      return;
    }
    const selectedPopularSite = popularSites.sites[indexOfPopularSite];

    const { formInputs } = this.state;
    const filledInputs = { ...formInputs };

    if (filledInputs.providerName.inputValue === PROVIDERS.NRQL.value) {
      filledInputs.hostName = { ...emptyInputState };
      delete filledInputs.nrqlQuery;
    }

    filledInputs.hostName.inputValue = selectedPopularSite.hostName;
    filledInputs.serviceName.inputValue = selectedPopularSite.serviceName;
    filledInputs.providerName.inputValue = selectedPopularSite.provider;
    filledInputs.logoUrl.inputValue = selectedPopularSite.hostLogo;

    Object.keys(filledInputs).forEach(inputName => {
      filledInputs[inputName].validationText = '';
    });

    this.setState({
      formInputs: filledInputs,
      selectedPopularSiteIndex: indexOfPopularSite
    });
  }

  handleSelectKeyDown = event => {
    const { inputValue, value } = this.state;
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        this.setState({
          inputValue: '',
          value: [...value, createOption(inputValue)]
        });
        event.preventDefault();
    }
  };

  handleCORSChange = event => {
    const isChecked = event.target.checked;

    const { formInputs } = this.state;
    const updatedFormInputs = { ...formInputs };

    if (isChecked) {
      updatedFormInputs.corsProxyAddress = { ...emptyInputState };
      updatedFormInputs.corsProxyAddress.inputValue =
        'https://cors-anywhere.herokuapp.com/{url}';
    } else {
      delete updatedFormInputs.corsProxyAddress;
    }

    this.setState({
      hostRequiresProxy: isChecked,
      formInputs: updatedFormInputs
    });
  };

  handleProviderChange = event => {
    event.persist();
    const { formInputs } = this.state;
    const updatedFormInputs = { ...formInputs };
    updatedFormInputs.providerName.inputValue = event.target.value;

    if (updatedFormInputs.providerName.inputValue) {
      updatedFormInputs.providerName.validationText = '';

      if (updatedFormInputs.providerName.inputValue === PROVIDERS.NRQL.value) {
        delete updatedFormInputs.hostName;
        updatedFormInputs.nrqlQuery = { ...emptyInputState };
      } else {
        delete updatedFormInputs.nrqlQuery;
        updatedFormInputs.hostName = { ...emptyInputState };
      }
    }

    this.setState({ formInputs: updatedFormInputs });
  };

  onAccountSelected = async (accountId, accounts) => {
    if (!this.state.entityGuid) {
      let { keyObject } = this.state;
      keyObject = { ...keyObject, key: accountId };

      this.setState({
        selectedAccountId: accountId,
        accounts,
        keyObject
      });

      const hostNames = await getHostNamesFromNerdStorage({
        key: accountId,
        type: 'account'
      });
      this.setHostNames(hostNames);
    }
  };

  setSearchQuery = () => {
    this.setState({ searchQuery: event.target.value });
  };

  getGridItems() {
    const {
      searchQuery,
      hostNames,
      requestForHostnamesMade,
      entityGuid
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
          accountId={this.state.selectedAccountId}
        />
      </GridItem>
    ));
  }

  handleDeleteTileModal = hostname => {
    const { deleteTileModalActive } = this.state;
    this.setState({
      deleteTileModalActive: !deleteTileModalActive,
      tileToBeDeleted: hostname.hostName
    });
  };

  handleCreateTileModal = () => {
    const { createTileModalActive } = this.state;
    this.setState({ createTileModalActive: !createTileModalActive });
  };

  updateInputValue = (event, inputName) => {
    event.persist();
    const { formInputs } = this.state;
    const updatedFormInputs = { ...formInputs };
    updatedFormInputs[inputName].inputValue = event.target.value;

    if (updatedFormInputs[inputName].inputValue.length > 2) {
      updatedFormInputs[inputName].validationText = '';
    }

    this.setState({
      formInputs: updatedFormInputs
    });
  };

  render() {
    const {
      accounts,
      entityGuid,
      hostNames,
      selectedAccountId,
      deleteTileModalActive,
      createTileModalActive,
      formInputs,
      selectedPopularSiteIndex,
      hostRequiresProxy
    } = this.state;

    const {
      serviceName,
      hostName,
      providerName,
      logoUrl,
      nrqlQuery,
      corsProxyAddress
    } = formInputs;

    return (
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
          spacingType={[Grid.SPACING_TYPE.LARGE, Grid.SPACING_TYPE.LARGE]}
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
          <div className="select-container">
            <label>Quick setup</label>
            <select
              value={selectedPopularSiteIndex}
              onChange={e => this.handleQuickSetupSelect(e)}
            >
              <option value="">Choose a service</option>
              <option value="0">Google Cloud</option>
              <option value="1">GitHub</option>
              <option value="2">Jira</option>
              <option value="3">New Relic</option>
              <option value="4">Ezidebit</option>
            </select>
          </div>

          <hr className="or-sep" />

          <div className="select-container">
            <Checkbox
              onChange={this.handleCORSChange}
              label="Host requires CORS proxy"
            />
          </div>
          {hostRequiresProxy && (
            <div className="select-container">
              <TextFieldWrapper
                label="CORS proxy address"
                onChange={event => {
                  this.updateInputValue(event, 'corsProxyAddress');
                }}
                value={corsProxyAddress.inputValue}
                validationText={corsProxyAddress.validationText}
              />
            </div>
          )}

          <div className="select-container">
            <label>Provider</label>
            <select
              onChange={this.handleProviderChange}
              value={providerName.inputValue}
            >
              <option value="">Choose a provider</option>
              {Object.values(PROVIDERS).map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          {providerName.validationText && (
            <p className="text-field__validation">
              {providerName.validationText}
            </p>
          )}

          <TextFieldWrapper
            label="Service name"
            onChange={event => {
              this.updateInputValue(event, 'serviceName');
            }}
            value={serviceName.inputValue}
            validationText={serviceName.validationText}
          />

          {providerName.inputValue === PROVIDERS.NRQL.value ? (
            <>
              <TextFieldWrapper
                label="NRQL"
                placeholder="Put your NRQL query here"
                onChange={event => {
                  this.updateInputValue(event, 'nrqlQuery');
                }}
                value={nrqlQuery.inputValue}
                validationText={nrqlQuery.validationText}
              />
              <p>
                Correct NRQL query must contain following fields/aliases:
                EventName, EventStatus and EventTimeStamp.
              </p>
            </>
          ) : (
            <TextFieldWrapper
              label="Hostname"
              placeholder="https://status.myservice.com/"
              onChange={event => {
                this.updateInputValue(event, 'hostName');
              }}
              value={hostName.inputValue}
              validationText={hostName.validationText}
            />
          )}

          <TextFieldWrapper
            label="Service logo (url)"
            onChange={event => {
              this.updateInputValue(event, 'logoUrl');
            }}
            value={logoUrl.inputValue}
            validationText={logoUrl.validationText}
            placeholder="https://myservice.com/logo.png"
          />

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
