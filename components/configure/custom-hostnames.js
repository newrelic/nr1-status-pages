import React from 'react';
import PropTypes from 'prop-types';
import {
  NerdGraphQuery,
  Button,
  HeadingText,
  Icon,
  TextField,
  Stack,
  StackItem
} from 'nr1';
import { v4 as uuidv4 } from 'uuid';
import { saveHostNamesToNerdStorage } from '../../utilities/nerdlet-storage';
import TagsModal from './modal-tag';

export default class CustomHostNames extends React.PureComponent {
  static propTypes = {
    entityGuid: PropTypes.string,
    accountId: PropTypes.number,
    addHostNameCallback: PropTypes.func,
    deleteHostNameCallback: PropTypes.func,
    hostNames: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      tagHidden: true,
      selectedProvider: 'statusPageIo',
      tags: [],
      keyObject: {
        key: props.entityGuid ? props.entityGuid : props.accountId,
        type: props.entityGuid ? 'entity' : 'account'
      },
      selectedEditHost: undefined
    };
    this.addHostName = this.addHostName.bind(this);
    this.onTextInputChange = this.onTextInputChange.bind(this);
    this.saveAll = this.saveAll.bind(this);
    this.onProviderChange = this.onProviderChange.bind(this);
    this.onTagModalClose = this.onTagModalClose.bind(this);
    this.addDepTypeCallback = this.addDepTypeCallback.bind(this);
  }

  addDepTypeCallback() {
    this.setState({ tagHidden: false });
  }

  editTags(hostNameObject) {
    this.setState({ tagHidden: false, selectedEditHost: hostNameObject });
  }

  async addHostName() {
    const { addHostNameCallback } = this.props;
    const { addHostNameText, selectedProvider, tags } = this.state;

    const hostNameObject = {
      id: uuidv4(),
      hostName: addHostNameText,
      provider: selectedProvider,
      tags: tags
    };
    this.setState({ tags: [] });
    addHostNameCallback(hostNameObject);
  }

  // TODO: Move to nerd store
  generateListHostNames() {
    const { deleteHostNameCallback, hostNames } = this.props;

    if (!hostNames) return <div />;
    return hostNames.map(hostNameObject => (
      <li key={hostNameObject.id} className="modal-list-item">
        <div className="modal-list-item-name"> {hostNameObject.hostName} </div>
        <div className="button-bar">
          <Button
            type={Button.TYPE.DESTRUCTIVE}
            sizeType={Button.SIZE_TYPE.SMALL}
            iconType={Button.ICON_TYPE.INTERFACE__SIGN__TIMES}
            onClick={() => {
              deleteHostNameCallback(hostNameObject.hostName);
            }}
          >
            Delete
          </Button>
          <Button
            type={Button.TYPE.NORMAL}
            sizeType={Button.SIZE_TYPE.SMALL}
            iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__EDIT}
            onClick={() => {
              this.editTags(hostNameObject);
            }}
          >
            Edit
          </Button>
        </div>
      </li>
    ));
  }

  _displaySaveMessage() {
    this.setState({ showSaved: true });
    setTimeout(() => this.setState({ showSaved: false }), 2 * 1000);
  }

  async saveAll() {
    const { hostNames } = this.props;
    try {
      // const accountsResults = await AccountsQuery.query();
      const accountsResults = await NerdGraphQuery.query({
        query: '{ actor { accounts { id name } }}'
      });
      if (
        accountsResults.data &&
        accountsResults.data.actor &&
        accountsResults.data.actor.accounts
      ) {
        accountsResults.data.actor.accounts.forEach(async account =>
          saveHostNamesToNerdStorage(
            { key: account.id, type: 'account' },
            hostNames
          )
        );
        this._displaySaveMessage();
      }
    } catch (err) {
      console.log(err); // eslint-disable-line no-console
    }
  }

  onTextInputChange(event) {
    this.setState({ addHostNameText: event.target.value });
  }

  onProviderChange(event) {
    this.setState({ selectedProvider: event.target.value });
  }

  onTagModalClose(tags) {
    this.setState({ tagHidden: true });
    this.setState({ tags: tags });
  }

  render() {
    const {
      keyObject,
      tagHidden,
      selectedEditHost,
      showSaved,
      selectedProvider
    } = this.state;
    const hostnames = this.generateListHostNames();
    return (
      <div className="configure-status-page-container">
        <div
          className={`modal-saved ${
            showSaved ? 'modal-saved-show' : 'modal-saved-hide'
          }`}
        >
          {' '}
          Saved <Icon type={Icon.TYPE.PROFILES__EVENTS__LIKE} />
        </div>
        <HeadingText
          className="modal-list-title"
          type={HeadingText.TYPE.HEADING_2}
        >
          {' '}
          Custom Host Names
        </HeadingText>
        <div className="modal-container">
          <div className="modal-text-add-container">
            <div className="text-field-flex">
              <TextField
                className="add-host-name"
                onChange={this.onTextInputChange}
                label="Add new hostname"
                placeholder="e.g. https://status.newrelic.com/"
              />
              <div className="add-status-page-config">
                <select
                  className="btn-white"
                  onChange={this.onProviderChange}
                  value={selectedProvider}
                >
                  <option value="statusPageIo">Status Page Io</option>
                  <option value="google">Google</option>
                  <option value="statusIo">Status Io</option>
                </select>
                <TagsModal
                  addDepTypeCallback={this.addDepTypeCallback}
                  hostName={selectedEditHost}
                  hidden={tagHidden}
                  onClose={this.onTagModalClose}
                />
              </div>
            </div>
            <Button
              className="add-button"
              type={Button.TYPE.PRIMARY}
              onClick={this.addHostName}
              sizeType={Button.SIZE_TYPE.NORMAL}
              iconType={Button.ICON_TYPE.INTERFACE__SIGN__PLUS}
            >
              Add
            </Button>
          </div>
          <div className="modal-list-container">
            <ul className="modal-list">{hostnames}</ul>
          </div>
          {keyObject.type === 'account' && (
            <Stack horizontalType={Stack.HORIZONTAL_TYPE.CENTER} fullWidth>
              <StackItem>
                <Button
                  iconType={
                    Button.ICON_TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__CLOUD
                  }
                  onClick={this.saveAll}
                  type={Button.TYPE.NORMAL}
                >
                  Sync All Accounts
                </Button>
              </StackItem>
            </Stack>
          )}
        </div>
      </div>
    );
  }
}
