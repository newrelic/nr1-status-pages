
import React from 'react';
import PropTypes from 'prop-types';

import {NerdGraphQuery, UserStorageMutation, UserStorageQuery} from 'nr1';

const USER_ACCOUNT_COLLECTION = 'user_account_collection_v0';
const USER_SELECTED_ACCOUNT_ID = 'user_account_id'

export default class AccountPicker extends React.Component {
    static propTypes = {
        hostname: PropTypes.string,
        refreshRate: PropTypes.number
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedAccount: '',
            accounts: []
        }
        this.onAccountChange = this.onAccountChange.bind(this);
    }

    async componentDidMount() {
        try {
            // const accountsResults = await AccountsQuery.query();
            const accountsResults = await NerdGraphQuery.query({query: "{ actor { accounts { id name } }}"});
            if (accountsResults.data && accountsResults.data.actor && accountsResults.data.actor.accounts) {
                this.setState({'accounts': accountsResults.data.actor.accounts});
                let accountId = await this.getLastChoseAccountId();
                if (!accountId) accountId = accountsResults.data.actor.accounts[0].id;
                this._accountChanged(accountId);
            }
        } catch(err) {
            console.debug(err);
        }
    }


    generateAccountDropDownItems() {
        return this.state.accounts.map( account =>
                (<option key={account.id} value={account.id}>
                    {account.name}
                </option>));
    }

    async getLastChoseAccountId() {
        const userStorageQuery = {
            collection: USER_ACCOUNT_COLLECTION,
            documentId: USER_SELECTED_ACCOUNT_ID
        }
        // TODO: Add error handling
        const queryResults = await UserStorageQuery.query(userStorageQuery);
        console.debug("getLastChoseAccountId", queryResults);
        return queryResults.data
    }

    async saveOffLastChosenAccountId(accountId) {
        const userMutation = {
            actionType: UserStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
            collection: USER_ACCOUNT_COLLECTION,
            document: accountId,
            documentId: USER_SELECTED_ACCOUNT_ID
        }
        UserStorageMutation.mutate(userMutation);
    }

    async _accountChanged(accountId){
        const {accountChangedCallback} = this.props;
        accountId = parseInt(accountId);
        this.saveOffLastChosenAccountId(accountId);
        if (accountChangedCallback) {
            await accountChangedCallback(accountId, this.state.accounts);
        }
        this.setState({'selectedAccount': accountId});
    }

    async onAccountChange(event) {
        await this._accountChanged(event.target.value);
    }

    render() {
        const {selectedAccount} = this.state;
        return (
            <select value={selectedAccount} onChange={this.onAccountChange}>
                {this.generateAccountDropDownItems()}
            </select>
        );
    }
}


