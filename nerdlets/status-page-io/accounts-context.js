import React from 'react';
// TODO: Use AccountContext
export const AccountContext = React.createContext({
    accounts: 12,
    accountId: 123
    // updateAccountId: (value) => this.accountId = value,
    // updateAccounts: (value) => this.accounts = value
});