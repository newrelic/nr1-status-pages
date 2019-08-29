import React from 'react';
import PropTypes from 'prop-types';

import {AccountsQuery, HeadingText, Grid, GridItem} from 'nr1';

import { getHostNamesFromNerdStorage, saveHostNamesToNerdStorage } from '../status-page-io/utilities/nerdlet-storage';
import StatusPage from '../status-page-io/status-page';

export default class SuggestedStatusPages extends React.Component {
    static propTypes = {
        nerdletUrlState: PropTypes.object,
        launcherUrlState: PropTypes.object,
        width: PropTypes.number,
        height: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = {
            hostNames: [],
            selectedHostNames: []
        }
        this.checkAddToDashBoard = this.checkAddToDashBoard.bind(this);
    }

    async componentDidMount() {
        const accountsResults = await AccountsQuery.query();
        if (accountsResults.data && accountsResults.data.actor && accountsResults.data.actor.accounts) {
            const accounts = accountsResults.data.actor.accounts;
            const allHostNames = [];
            for (let i = 0; i < accounts.length; i++) {
                console.log(accounts[i]);
                const storedHostNames = await getHostNamesFromNerdStorage({key: accounts[i].id, type: 'account'});
                storedHostNames.forEach(hostName => {
                    if (!allHostNames.find(host => host.hostName === hostName.hostName)) {
                        allHostNames.push(hostName)
                    }
                });
            }
            this.setState({'hostNames': allHostNames});
        }
    }

    async checkAddToDashBoard(hostName, event) {
        const {selectedHostNames} = this.state;
        const selected = !hostName.isSelected;
        if (selected) {
            selectedHostNames.push(hostName);
        } else {
            selectedHostNames.splice(selectedHostNames.findIndex(val => val.hostName === hostName.hostName), 1);
        }
        hostName.isSelected = selected;
        this.setState({'hostName': this.state.hostNames});
        await saveHostNamesToNerdStorage({key: this.props.nerdletUrlState.entityGuid, type: 'entity'}, this.state.selectedHostNames.map(hostName=> {
            return {
                hostName: hostName.hostName,
                provider: hostName.provider
            }
        }));
    }

    generateStatusPages() {
        return this.state.hostNames.map(hostname => (
            <GridItem className="status-page-grid-item" key={hostname.hostName} columnSpan={6}>
                <div onClick={this.checkAddToDashBoard.bind(this, hostname)} className={`status-page-wrapper ${hostname.isSelected ? 'selected': ''}`}>
                    <StatusPage refreshRate={15} hostname={hostname.hostName} provider={hostname.provider}/>
                </div>
            </GridItem>
        ));
    }

    render() {
        return (
            <div>
                <HeadingText className="suggested-status-page-title" type={HeadingText.TYPE.HEADING1}>Suggested Status Pages</HeadingText>
                <div className="suggested-status-grid-container">
                    <Grid>
                        {this.generateStatusPages()}
                    </Grid>
                </div>
            </div>
        );
    }
}
