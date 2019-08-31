import React from 'react';
import PropTypes from 'prop-types';

import {AccountsQuery, Button, HeadingText, Grid, GridItem, Spinner, Tabs, TabsItem, TextField, NerdGraphQuery} from 'nr1';

import { saveHostNamesToNerdStorage } from '../status-page-io/utilities/nerdlet-storage';
import StatusPage from '../status-page-io/status-page';

import {flatten, uniqBy} from 'lodash';

const HOST_NAMES_COLLECTION_KEY = 'host_names_v0'
const HOST_NAMES_DOCUMENT_ID = 'host_names'

const MAX_ACCOUNT_DOC_FIELD_COUNT = 37; // Max size is 200 fields so to be safe we aim for 150

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
            selectedHostNames: [],
            loading: true,
            tags: []
        }
        this.checkAddToDashBoard = this.checkAddToDashBoard.bind(this);
        this.searchForDependencyTags = this.searchForDependencyTags.bind(this);
        this.toggleAddRelationShip = this.toggleAddRelationShip.bind(this);
    }

    async componentDidMount() {
        const accountsResults = await AccountsQuery.query();
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
            this.setState({'hostNames': allHostNames});
            this.setState({'loading': false});
        }
    }

    async checkAddToDashBoard(hostName) {
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
                provider: hostName.provider,
                tags: hostName.tags
            }
        }));
    }

    searchForDependencyTags(relationship) {
        return this.state.hostNames.find(hostNameObject => hostNameObject.tags && hostNameObject.tags.includes(relationship.name.toLowerCase()))
    }

    toggleAddRelationShip(relationship) {
        relationship.isSelected = !relationship.isSelected;
        // TODO: BAD
        this.forceUpdate();
    }

    generateDepli() {
        return this.props.nerdletUrlState.relationships.map(relationship => {
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

    generateStatusPages() {
        return this.state.hostNames.map(hostname => (
            <GridItem className="status-page-grid-item" key={hostname.hostName} columnSpan={6}>
                <div onClick={this.checkAddToDashBoard.bind(this, hostname)} className={`status-page-wrapper ${hostname.isSelected ? 'selected': ''}`}>
                    <StatusPage refreshRate={15} hostname={hostname.hostName} provider={hostname.provider}/>
                </div>
            </GridItem>
        ));
    }

    getStatusGrid() {
        if (this.state.loading) return <Spinner fillContainer/>
        return(
        <Grid>
            {this.generateStatusPages()}
        </Grid>

        )
    }
    render() {
        return (
            <div>
                <HeadingText className="suggested-status-page-title" type={HeadingText.TYPE.HEADING1}>Suggested Status Pages</HeadingText>
                <Tabs>
                    <TabsItem itemKey="accounts" label="Suggested Status Pages">
                        <div className="suggested-status-grid-container">
                            {this.getStatusGrid()}
                        </div>
                    </TabsItem>
                    <TabsItem itemKey="dep" label="Entity Dependencies">
                        <div className="suggested-status-dependencies-container">
                        <HeadingText className="suggested-status-page-title" type={HeadingText.TYPE.HEADING3}>Detected the following external Dependencies you may want to watch</HeadingText>
                            <ul className="relationships">
                                {this.generateDepli()}
                            </ul>
                        </div>
                    </TabsItem>
                </Tabs>
            </div>
        );
    }
}
