import React from 'react';
import PropTypes from 'prop-types';
const uuid = require('uuid/v4');


import {AccountsQuery, Button, HeadingText, Grid, GridItem, Spinner, Tabs, TabsItem, NerdGraphQuery} from 'nr1';

import { getHostNamesFromNerdStorage, saveHostNamesToNerdStorage } from '../../utilities/nerdlet-storage';
import StatusPage from '../status-page-io/status-page';

import { popularSites } from '../../popular-status-pages';

import {flatten, uniqBy} from 'lodash';
import CustomHostNames from '../../components/configure/custom-hostnames';

const HOST_NAMES_COLLECTION_KEY = 'host_names_v0'
const HOST_NAMES_DOCUMENT_ID = 'host_names'

const MAX_ACCOUNT_DOC_FIELD_COUNT = 37; // Max size is 200 fields so to be safe we aim for 150

export default class ConfigureStatusPages extends React.Component {
    static propTypes = {
        nerdletUrlState: PropTypes.object,
        launcherUrlState: PropTypes.object,
        width: PropTypes.number,
        height: PropTypes.number,
    };

    constructor(props) {
        super(props);
        const {accountId, entityGuid}  = this.props.nerdletUrlState;
        this.state = {
            allAccountHostNames: [],
            hostNames: [],
            selectedHostNames: [],
            loading: true,
            tags: [],
            relationships: [],
            keyObject: {key: entityGuid ? entityGuid : accountId, type: entityGuid ? 'entity' : 'account'},
        }
        this.addHostName = this.addHostName.bind(this);
        this.deleteHostName = this.deleteHostName.bind(this);
        this.checkAddToDashBoard = this.checkAddToDashBoard.bind(this);
        this.searchForDependencyTags = this.searchForDependencyTags.bind(this);
        this.toggleAddRelationShip = this.toggleAddRelationShip.bind(this);
    }

    async componentDidMount() {
        const {keyObject} = this.state;

        const accountsResults = await AccountsQuery.query();
        this.setState({'hostNames': await getHostNamesFromNerdStorage(keyObject)});
        if (accountsResults.data && accountsResults.data.actor && accountsResults.data.actor.accounts) {
            const accounts = accountsResults.data.actor.accounts;
            let allHostNames = [];

            const chuckedAccounts = [];
            while(accounts && accounts.length > 0) {
                chuckedAccounts.push(accounts.splice(0, MAX_ACCOUNT_DOC_FIELD_COUNT))
            }

            for(var i = 0; i < chuckedAccounts.length; i++) {
                let queryString = chuckedAccounts[i].map((account, index) => ` ${'a'.repeat(index+1)}: account(id: ${account.id}) { nerdStorage { document(collection: "${HOST_NAMES_COLLECTION_KEY}", documentId: "${HOST_NAMES_DOCUMENT_ID}") } } `).join(' ');
                queryString = `{ actor { ${queryString} } }`;
                const graphqlQuery = { query: queryString}


                const relationshipsResults = await NerdGraphQuery.query(graphqlQuery);
                Object.keys(relationshipsResults.data.actor).forEach(key => {
                    const nerdStorage = relationshipsResults.data.actor[key].nerdStorage;
                    if (nerdStorage && nerdStorage.document) {
                        allHostNames.push(nerdStorage.document);
                    }
                });
            }

            allHostNames = uniqBy(flatten(allHostNames), 'hostName');
            this.setState({'allAccountHostNames': allHostNames});
            this.setState({'loading': false});
        }
        if (this.props.nerdletUrlState.entityGuid) {
            this.getEntitityRelationShips();
        }
    }

    async save() {
        const {keyObject, hostNames} = this.state;
        await saveHostNamesToNerdStorage(keyObject, hostNames);
    }

    async addHostName(hostNameObject) {
        const {hostNames} = this.state;
        hostNames.push(hostNameObject);
        this.setState({'hostNames': this.state.hostNames});
        await this.save();
    }

    async deleteHostName(hostNameText) {
        const {hostNames} = this.state;
        hostNames.splice(hostNames.findIndex(val => val.hostName === hostNameText), 1);
        this.setState({'hostNames': hostNames});
        await this.save();
    }

    async checkAddToDashBoard(hostNameObject) {
        const {keyObject, hostNames} = this.state;
        hostNameObject.isSelected = !hostNameObject.isSelected;
        if (hostNameObject.isSelected) {
            hostNames.push(hostNameObject);
        } else {
            hostNames.splice(hostNames.findIndex(val => val.hostName === hostNameObject.hostName), 1);
        }
        await saveHostNamesToNerdStorage(keyObject,
         hostNames.map(hostName=> {
            return {
                id: uuid(),
                hostName: hostName.hostName,
                provider: hostName.provider,
                tags: hostName.tags
            }
        }));
        this.setState({'hostNames': hostNames});
    }

    searchForDependencyTags(relationship) {
        return this.state.hostNames.find(hostNameObject => hostNameObject.tags && hostNameObject.tags.includes(relationship.name.toLowerCase()))
    }

    toggleAddRelationShip(relationship) {
        relationship.isSelected = !relationship.isSelected;
        // TODO: BAD
        this.forceUpdate();
    }

    async getEntitityRelationShips() {
        const {entityGuid}  = this.props.nerdletUrlState;
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
            const external_relationships = relationships.filter(relationship =>
                relationship.target.entity.entityType !== 'APM_APPLICATION_ENTITY')
                    .map(filteredResults => {return filteredResults.target.entity.name });
            const distinct_external_rel = [...new Set(external_relationships)];
            this.setState({'relationships': distinct_external_rel.map(rel =>  { return {name: rel, isSelected: false} })});

        } catch (err) {
            console.log(err);
        }
    }


    generateDepli() {
        return this.state.relationships.map(relationship => {
            const foundMatch = this.searchForDependencyTags(relationship);
            return (
                <li key={relationship.name} className="modal-list-item">
                    <div className="modal-list-item-name"> {relationship.name} </div>
                    <div className="button-bar">
                        {foundMatch &&
                            <Button
                                className={`${foundMatch.isSelected ? 'selected': ''}`}
                                onClick={this.checkAddToDashBoard.bind(this, foundMatch)}
                                Type={Button.ICON_TYPE.INTERFACE__SIGN__PLUS}
                                tagType={Button.TAG_TYPE.BUTTON}>
                                    Found Matching Status Page
                            </Button>}
                            {!foundMatch &&
                                <Button
                                    className={`btn-white ${relationship.isSelected ? 'selected': ''}`}
                                    onClick={this.toggleAddRelationShip.bind(this, relationship)}
                                    iconType={relationship.isSelected ? Button.ICON_TYPE.INTERFACE__SIGN__CHECKMARK: Button.ICON_TYPE.INTERFACE__SIGN__PLUS}
                            tagType={Button.TAG_TYPE.BUTTON}></Button> }
                    </div>
                </li>
        );})
    }

    generateStatusPages(hostNames) {
        return hostNames.map((hostname, index) => (
            <GridItem className="status-page-grid-item" key={`${hostname.id}`} columnSpan={6}>
                <div onClick={this.checkAddToDashBoard.bind(this, hostname)} className={`status-page-wrapper ${hostname.isSelected ? 'selected': ''}`}>
                    <StatusPage refreshRate={15} hostname={hostname.hostName} provider={hostname.provider}/>
                </div>
            </GridItem>
        ));
    }

    getStatusGridItems(hostNames) {
        if (this.state.loading) return <Spinner fillContainer/>
        return(
        <Grid>
            {this.generateStatusPages(hostNames)}
        </Grid>

        )
    }

    render() {
        const {allAccountHostNames, hostNames} = this.state;
        const {accountId, entityGuid} = this.props.nerdletUrlState;
        return (
            <div>
                <HeadingText className="suggested-status-page-title" type={HeadingText.TYPE.HEADING1}>Configure Status Pages</HeadingText>
                <Tabs>
                    <TabsItem itemKey="custom" label="Custom HostNames">
                        <CustomHostNames
                            hostNames={hostNames}
                            addHostNameCallback={this.addHostName}
                            deleteHostNameCallback={this.deleteHostName}
                            accountId={accountId}
                            entityGuid={entityGuid} />
                    </TabsItem>
                    <TabsItem itemKey="accounts" label="Suggested Account Status Pages">
                        <div className="suggested-status-grid-container">
                            {this.getStatusGridItems(allAccountHostNames)}
                        </div>
                    </TabsItem>
                    <TabsItem itemKey="popular-sites" label="Popular Status Pages">
                        <div className="suggested-status-grid-container">
                            {this.getStatusGridItems(popularSites.sites)}
                        </div>
                    </TabsItem>
                    {entityGuid && <TabsItem itemKey="dep" label="Entity Dependencies">
                        <div className="suggested-status-dependencies-container">
                        <HeadingText className="suggested-status-page-title" type={HeadingText.TYPE.HEADING3}>Detected the following external Dependencies you may want to watch</HeadingText>
                            <ul className="relationships">
                                {this.generateDepli()}
                            </ul>
                        </div>
                    </TabsItem>}
                </Tabs>
            </div>
        );
    }
}
