import React from 'react';
import PropTypes from 'prop-types';

import {
  AccountsQuery,
  Dropdown,
  DropdownItem,
  UserStorageMutation,
  UserStorageQuery,
  TextField,
} from 'nr1';

const USER_ACCOUNT_COLLECTION = 'user_account_collection_v1';
const USER_SELECTED_ACCOUNT_ID = 'user_account_id';

export default class AccountPicker extends React.PureComponent {
  static propTypes = {
    accountChangedCallback: PropTypes.func,
    disabled: PropTypes.bool,
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

    let account = await this.getLastChoseAccountId();
    if (accountsResults.data) {
      const accounts = accountsResults.data;

      if (!account?.id) {
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
    return queryResults.data.account;
  }

  async saveOffLastChosenAccountId(account) {
    const userMutation = {
      actionType: UserStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
      collection: USER_ACCOUNT_COLLECTION,
      document: { account: account },
      documentId: USER_SELECTED_ACCOUNT_ID,
    };
    UserStorageMutation.mutate(userMutation);
  }

  async _accountChanged(account, accounts) {
    const accountId = account.id;
    const { accountChangedCallback } = this.props;
    this.saveOffLastChosenAccountId(account);
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
      filteredAccounts = accounts.filter((a) => {
        return a.name.match(re);
      });
    }
    if (this.props.disabled) {
      return (
        <TextField disabled label="Account" value={selectedAccount.name} />
      );
    }

    return (
      <Dropdown
        title={selectedAccount.name || 'Account'}
        search={filter}
        onSearch={(event) => {
          this.setState({ filter: event.target.value });
        }}
      >
        {filteredAccounts.map((a) => (
          <DropdownItem key={a.id} onClick={() => this.onAccountChange(a)}>
            {a.name}
          </DropdownItem>
        ))}
      </Dropdown>
    );
  }
}
