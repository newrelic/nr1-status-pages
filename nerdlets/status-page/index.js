import React from 'react';
import PropTypes from 'prop-types';
import StatusPage from './status-page';

import {HeadingText, navigation, NerdGraphQuery, Grid, GridItem, Spinner} from 'nr1';
import Toolbar from '../../components/toolbar';
import { getHostNamesFromNerdStorage } from '../../utilities/nerdlet-storage';

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
            entityGuid: props.nerdletUrlState.entityGuid,
            suggestedDependencies: [],
            selectedAccountId: undefined,
            hostNames: [],
            refreshRate: 15
        }
        this.onAccountSelected = this.onAccountSelected.bind(this);
        this.onRefreshRateSelected = this.onRefreshRateSelected.bind(this);
        this.setHostNames = this.setHostNames.bind(this);
        //! Bad hack
        this.pollHosts();
    }

    async componentDidMount() {
        if (this.state.entityGuid) {
            const hostNames = await getHostNamesFromNerdStorage({key: this.state.entityGuid, type: 'entity'});
            this.setHostNames(hostNames);
        }
    }

    setHostNames(hostNames) {
        this.setState({'hostNames': hostNames});
    }

    async onAccountSelected(accountId, accounts) {
        this.setState({'selectedAccountId': accountId});
        this.setState({'accounts': accounts});

        const hostNames = await getHostNamesFromNerdStorage({key: accountId, type: 'account'});
        this.setHostNames(hostNames);
    }

    //! This is a hack until there is an message bus between stacked nerdlets
    async pollHosts() {
        setTimeout(async () => {
            try {
                const hostNames = await getHostNamesFromNerdStorage( {key: this.state.entityGuid ? this.state.entityGuid : this.state.selectedAccountId, type: this.state.entityGuid ? 'entity' : 'account'});
                if (JSON.stringify(hostNames) !== JSON.stringify(this.state.hostNames)) {
                    this.setHostNames(hostNames);
                }
            } catch (err) {
                console.log(err);
            } finally {
                this.pollHosts();
            }
        }, 5 * 1000)
    }


    onRefreshRateSelected(event) {
        this.setState({'refreshRate': parseInt(event.currentTarget.text)});
    }

    getGridItems() {
        if (!this.state.hostNames || (!this.state.selectedAccountId && !this.state.entityGuid)) {
            return <Spinner fillContainer/>;
        }
        if (this.state.hostNames.length === 0) {
            return <GridItem  className="no-status-pages" columnStart={1} columnEnd={12}>
                    <HeadingText className="suggested-status-page-title" type={HeadingText.TYPE.HEADING1}>
                        No Status Pages are configured
                    </HeadingText>
                </GridItem>
        }
        return this.state.hostNames.map(hostname => (
            <GridItem className="status-page-grid-item" key={hostname.id} columnSpan={6}>
                <div className="status-page-wrapper">
                    <StatusPage refreshRate={this.state.refreshRate} hostname={hostname.hostName} provider={hostname.provider}/>
                </div>
            </GridItem>
        ));
    }

    render() {
        const {accounts, entityGuid, hostNames, refreshRate, selectedAccountId} = this.state;
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
                        <Grid className="status-container">
                            { this.getGridItems()}
                        </Grid>
                </div>
            // </AccountsContext.Provider>
        )
    }
}
