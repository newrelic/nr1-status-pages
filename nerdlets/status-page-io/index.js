import React from 'react';
import PropTypes from 'prop-types';
import StatusPage from './status-page';

import {Grid, GridItem, Spinner} from 'nr1';
import Toolbar from './components/toolbar';
import AccountNerdletStorage from './utilities/nerdlet-storage';

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
        this.accountNerdletStorage = new AccountNerdletStorage(this.state.selectedAccountId, 1 * 60 * 30);
        this.onAccountSelected = this.onAccountSelected.bind(this);
        this.onRefreshRateSelected = this.onRefreshRateSelected.bind(this);
        this.setHostNames = this.setHostNames.bind(this);
    }

    setHostNames(hostNames) {
        this.setState({'hostNames': hostNames});
    }

    async onAccountSelected(accountId) {
        this.setState({'selectedAccountId': accountId});
        this.accountNerdletStorage.accountId = accountId;
        const hostNames = await this.accountNerdletStorage.getStatusPageIoHostNames();
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
            <GridItem key={hostname} columnSpan={6}>
                <StatusPage refreshRate={this.state.refreshRate} hostname={hostname}/>
            </GridItem>
        ));
    }

    render() {
        const {refreshRate, selectedAccountId} = this.state;
        return (
            <div>
                <Toolbar refreshRateCallback={this.onRefreshRateSelected} refreshRate={refreshRate} onAccountSelected={this.onAccountSelected} selectedAccountId={selectedAccountId}/>
                {selectedAccountId &&
                    <Grid className="status-container">
                        { this.getGridItems()}
                    </Grid>
                }
                {!selectedAccountId &&
                    <Spinner/>
                }
            </div>
        )
    }
}
