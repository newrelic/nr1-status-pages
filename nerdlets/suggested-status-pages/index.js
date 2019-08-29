import React from 'react';
import PropTypes from 'prop-types';

import {AccountsQuery, Button, HeadingText, Grid, GridItem, Spinner, Tabs, TabsItem} from 'nr1';

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
            selectedHostNames: [],
            loading: true,
            tags: []
        }
        this.checkAddToDashBoard = this.checkAddToDashBoard.bind(this);
        this.searchForDependencyTags = this.searchForDependencyTags.bind(this);
    }

    async componentDidMount() {
        const accountsResults = await AccountsQuery.query();
        if (accountsResults.data && accountsResults.data.actor && accountsResults.data.actor.accounts) {
            const accounts = accountsResults.data.actor.accounts;
            const allHostNames = [];
            for (let i = 0; i < accounts.length; i++) {
                const storedHostNames = await getHostNamesFromNerdStorage({key: accounts[i].id, type: 'account'});
                storedHostNames.forEach(hostName => {
                    if (!allHostNames.find(host => host.hostName === hostName.hostName)) {
                        allHostNames.push(hostName)
                    }
                });
            }
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
        return this.state.hostNames.find(hostNameObject => hostNameObject.tags && hostNameObject.tags.includes(relationship.toLowerCase()))
    }

    generateDepli() {
        return this.props.nerdletUrlState.relationships.map(relationship => {
            const foundMatch = this.searchForDependencyTags(relationship);
            return (
                <li key={relationship} className="modal-list-item">
                    <div className="modal-list-item-name"> {relationship} </div>
                    <div className="button-bar">
                        {foundMatch &&
                            <Button
                                className={`${foundMatch.isSelected ? 'selected': ''}`}
                                onClick={this.checkAddToDashBoard.bind(this, foundMatch)}
                                Type={Button.ICON_TYPE.INTERFACE__SIGN__PLUS}
                                tagType={Button.TAG_TYPE.BUTTON}>
                                    Found Matching Status Page
                            </Button>}
                            <Button
                                className="btn-white"
                                onClick={this.addHostName}
                                iconType={Button.ICON_TYPE.INTERFACE__SIGN__PLUS}
                                tagType={Button.TAG_TYPE.BUTTON}></Button>
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
                    <TabsItem itemKey="dep" label="Dependencies">
                        <div className="suggested-status-dependencies-container">
                        <HeadingText className="suggested-status-page-title" type={HeadingText.TYPE.HEADING3}>Detected the following external Dependencies you may want to watch</HeadingText>
                            <ul className="relationships">
                                {this.generateDepli()}
                            </ul>
                        </div>
                    </TabsItem>
                    <TabsItem itemKey="accounts" label="Account Options">
                        <div className="suggested-status-grid-container">
                            {this.getStatusGrid()}
                        </div>
                    </TabsItem>
                </Tabs>
            </div>
        );
    }
}
