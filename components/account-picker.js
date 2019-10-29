import React from 'react';
import PropTypes from 'prop-types';

import {
  AccountsQuery,
  Dropdown,
  DropdownItem,
  UserStorageMutation,
  UserStorageQuery,
} from 'nr1';

const USER_ACCOUNT_COLLECTION = 'user_account_collection_v1';
const USER_SELECTED_ACCOUNT_ID = 'user_account_id';

export default class AccountPicker extends React.Component {
  static propTypes = {
    hostname: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedAccount: { name: '' },
      accounts: [],
      filter: '',
    };
    this.onAccountChange = this.onAccountChange.bind(this);
  }

  async componentDidMount() {
    const accountsResults = await AccountsQuery.query({});

    if (accountsResults.data && accountsResults.data) {
      const accounts = accountsResults.data;

      let account = await this.getLastChoseAccountId();

      if (account === null) {
        account = accountsResults.data;
      }

      if (!account.id) {
        account = accounts[0];
      }

      if (account) {
        this._accountChanged(account, accounts);
      } else {
        this.setState({ accounts });
      }
    }
  }

  async getLastChoseAccountId() {
    const userStorageQuery = {
      collection: USER_ACCOUNT_COLLECTION,
      documentId: USER_SELECTED_ACCOUNT_ID,
    };
    // TODO: Add error handling
    const queryResults = await UserStorageQuery.query(userStorageQuery);
    return queryResults.data;
  }

  async saveOffLastChosenAccountId(accountId) {
    const userMutation = {
      actionType: UserStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
      collection: USER_ACCOUNT_COLLECTION,
      document: { account: accountId },
      documentId: USER_SELECTED_ACCOUNT_ID,
    };
    UserStorageMutation.mutate(userMutation);
  }

  async _accountChanged(account, accounts) {
    const accountId = account.id;
    const { accountChangedCallback } = this.props;
    this.saveOffLastChosenAccountId(accountId);
    if (accountChangedCallback) {
      await accountChangedCallback(accountId, this.state.accounts);
    }
    this.setState({ selectedAccount: account, accounts });
  }

  async onAccountChange(account) {
    const { accounts } = this.state;
    await this._accountChanged(account, accounts);
  }

  render() {
    const { accounts, filter, selectedAccount } = this.state;

    let filteredAccounts = [...accounts];
    if (filter && filter.length > 0) {
      const re = new RegExp(filter, 'i');
      filteredAccounts = accounts.filter(a => {
        return a.name.match(re);
      });
    }

    return (
      <Dropdown
        title={selectedAccount.name}
        label="Account"
        search={filter}
        onSearch={event => {
          this.setState({ filter: event.target.value });
        }}
      >
        {filteredAccounts.map(a => (
          <DropdownItem key={a.id} onClick={() => this.onAccountChange(a)}>
            {a.name}
          </DropdownItem>
        ))}
      </Dropdown>
    );
  }
}
