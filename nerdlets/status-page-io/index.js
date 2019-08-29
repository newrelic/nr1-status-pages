import React from 'react';
import PropTypes from 'prop-types';
import StatusPage from './status-page';

import {HeadingText, navigation, NerdGraphQuery, Grid, GridItem, Spinner} from 'nr1';
import Toolbar from './components/toolbar';

import AccountsContext from './accounts-context';
import { getHostNamesFromNerdStorage } from './utilities/nerdlet-storage';

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
    }

    async componentDidMount() {
        if (this.state.entityGuid) {
            const hostNames = await getHostNamesFromNerdStorage({key: this.state.entityGuid, type: 'entity'});
            this.setHostNames(hostNames);
            if (hostNames.length === 0) {
                const graphQlResponse = await this.getEntitityRelationShipsAndAccountId();
                const nerdletWithState = {
                    id: '8fa8868a-b354-4d8a-aed8-8b757ea3d5f2.suggested-status-pages',
                    urlState: {
                        accountId: graphQlResponse.accountId,
                        entityGuid: this.state.entityGuid,
                        relationships: graphQlResponse.relationships
                    }
               };
                navigation.openStackedNerdlet(nerdletWithState);
            }
        }
    }

    async getEntitityRelationShipsAndAccountId() {
        const {entityGuid}  = this.state;
        const query = {
            query: `
              {
                actor {
                  entity(guid: "${entityGuid}") {
                    accountId
                    relationships {
                      target {
                        entity {
                            name
                            entityType
                        }
                      }
                    }
                  }
                }
              }`
            }
        try {
            const relationshipsResults = await NerdGraphQuery.query(query);
            const relationships = relationshipsResults.data.actor.entity.relationships;
            const accountId = relationshipsResults.data.actor.entity.accountId;
            const external_relationships = relationships.filter(relationship =>
                relationship.target.entity.entityType !== 'APM_APPLICATION_ENTITY')
                    .map(filteredResults => {return filteredResults.target.entity.name });
            const distinct_external_rel = [...new Set(external_relationships)];
            return  {accountId, relationships: distinct_external_rel.map(rel =>  { return {name: rel, isSelected: false} } )};
        } catch (err) {
            console.log(err);
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
            <GridItem className="status-page-grid-item" key={hostname.hostName} columnSpan={6}>
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
                        />
                        <Grid className="status-container">
                            { this.getGridItems()}
                        </Grid>
                </div>
            // </AccountsContext.Provider>
        )
    }
}
