import React from 'react';
import PropTypes from 'prop-types';
import StatusPage from './status-page';

import {Grid, GridItem, Spinner} from 'nr1';
import Toolbar from './components/toolbar';
import AccountNerdletStorage from './utilities/nerdlet-storage';

import AccountsContext from './accounts-context';

export default class StatusPageIoMainPage extends React.Component {
    static propTypes = {
        nerdletUrlState: PropTypes.object,
        launcherUrlState: PropTypes.object,
        width: PropTypes.number,
        height: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedAccountId: undefined,
            hostNames: [],
            refreshRate: 15
        }
        this.accountNerdletStorage = new AccountNerdletStorage(this.state.selectedAccountId);
        this.onAccountSelected = this.onAccountSelected.bind(this);
        this.onRefreshRateSelected = this.onRefreshRateSelected.bind(this);
        this.setHostNames = this.setHostNames.bind(this);
    }

    setHostNames(hostNames) {
        this.setState({'hostNames': hostNames});
    }

    // TODO: This is bad we should move accounts to context
    async onAccountSelected(accountId, accounts) {
        this.setState({'selectedAccountId': accountId});
        this.setState({'accounts': accounts})
        const hostNames = await this.accountNerdletStorage.getStatusPageIoHostNames(accountId);
        this.setHostNames(hostNames);
    }

    onRefreshRateSelected(event) {
        this.setState({'refreshRate': parseInt(event.currentTarget.text)});
    }

    getGridItems() {
        if (!this.state.hostNames || !this.state.selectedAccountId) {
            return <Spinner />;
        }
        if (this.state.hostNames.length === 0) {
            return <div>
                No StatusPageIo urls are configured
            </div>
        }
        return this.state.hostNames.map(hostname => (
            <GridItem key={hostname.hostName} columnSpan={6}>
                <StatusPage refreshRate={this.state.refreshRate} hostname={hostname.hostName} provider={hostname.provider}/>
            </GridItem>
        ));
    }

    render() {
        const {accounts, hostNames, refreshRate, selectedAccountId} = this.state;
        return (
            // <AccountsContext.Provider value={this.state}>
                <div>
                    <Toolbar
                        accounts={accounts}
                        refreshRateCallback={this.onRefreshRateSelected}
                        refreshRate={refreshRate}
                        onAccountSelected={this.onAccountSelected}
                        selectedAccountId={selectedAccountId}
                        hostNames={hostNames}
                        hostNameCallBack={this.setHostNames}
                        />
                    {selectedAccountId &&
                        <Grid className="status-container">
                            { this.getGridItems()}
                            <GridItem key="https://status.cloud.google.com/incidents.json" columnSpan={6}>
                                <StatusPage refreshRate={this.state.refreshRate} hostname="https://status.cloud.google.com/incidents.json" provider="google"/>
                            </GridItem>
                        </Grid>
                    }
                    {!selectedAccountId &&
                        <Spinner/>
                    }
                </div>
            // </AccountsContext.Provider>
        )
    }
}
