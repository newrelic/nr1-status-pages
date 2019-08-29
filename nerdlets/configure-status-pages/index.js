import React from 'react';
import PropTypes from 'prop-types';

import { Button, HeadingText, Icon, TextField } from 'nr1';

import { getHostNamesFromNerdStorage, saveHostNamesToNerdStorage } from '../status-page-io/utilities/nerdlet-storage';
import TagsModal from './modal-tag';

export default class ConfigureStatusPages extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hidden: true,
            tagHidden: true,
            mounted: false,
            unSavedChanges: [],
            selectedProvider: 'statusPageIo',
            tags: [],
            keyObject: {key: props.nerdletUrlState.entityGuid ? props.nerdletUrlState.entityGuid : props.nerdletUrlState.accountId, type: props.nerdletUrlState.entityGuid ? 'entity' : 'account'},
            selectedEditHost: undefined
        }
        this.addHostName = this.addHostName.bind(this);
        this.onTextInputChange = this.onTextInputChange.bind(this);
        this.save = this.save.bind(this);
        this.saveAll = this.saveAll.bind(this);
        this.deleteHost = this.deleteHost.bind(this);
        this.onProviderChange = this.onProviderChange.bind(this);
        this.onTagModalClose = this.onTagModalClose.bind(this);
        this.addDepTypeCallback = this.addDepTypeCallback.bind(this);
    }

    async componentDidMount() {
        const {keyObject} = this.state;

        const unSavedChanges = await getHostNamesFromNerdStorage(keyObject);
        this.setState({'unSavedChanges': unSavedChanges});
    }

    addDepTypeCallback() {
        this.setState({'tagHidden': false});
    }

    editTags(hostNameObject) {
        this.setState({'tagHidden': false, 'selectedEditHost': hostNameObject})
    }

    addHostName() {
        const {addHostName, selectedProvider, unSavedChanges, tags} = this.state;
        unSavedChanges.push({
            hostName: addHostName,
            provider: selectedProvider,
            tags: tags
        });
        this.setState({'unSavedChanges': unSavedChanges, 'tags': []});
    }

    deleteHost(hostname) {
        const {unSavedChanges} = this.state;
        unSavedChanges.splice(unSavedChanges.findIndex(val => val.hostName === hostname), 1);
        this.setState({'unSavedChanges': unSavedChanges});
    }

    // TODO: Move to nerd store
    generateListHostNames() {
        if (!this.state.unSavedChanges) return <div></div>
        return this.state.unSavedChanges.map(hostNameObject => <li key={hostNameObject.hostName} className="modal-list-item">
            <div className="modal-list-item-name"> {hostNameObject.hostName} </div>
            <div className="button-bar">
                <Button className="btn-white" iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__EDIT} onClick={this.editTags.bind(this, hostNameObject)}></Button>
                <Button className="btn-white" iconType={Button.ICON_TYPE.INTERFACE__SIGN__TIMES} onClick={this.deleteHost.bind(this, hostNameObject.hostName)}></Button>
            </div>
        </li>);
    }

    _displaySaveMessage() {
        this.setState({'showSaved': true});
        setTimeout(()=> this.setState({'showSaved': false}), 2 * 1000);
    }

    async save() {
        await saveHostNamesToNerdStorage(this.state.keyObject, this.state.unSavedChanges);
        this._displaySaveMessage();
    }

    async saveAll() {
        try {
            this.props.nerdletUrlState.accounts.forEach(async account=> await saveHostNamesToNerdStorage({key: account.id, type: 'account'}, this.state.unSavedChanges) );
            this._displaySaveMessage();
        } catch(err) {
            console.log(err);
        }
    }

    onTextInputChange(event) {
        this.setState({'addHostName': event.target.value});
    }

    onProviderChange(event) {
        this.setState({'selectedProvider': event.target.value})
    }

    onTagModalClose(tags) {
        this.setState({'tagHidden': true});
        this.setState({'tags': tags});
    }



    render() {
        const {keyObject, tagHidden, selectedEditHost, showSaved, selectedProvider} = this.state;
        const hostnames = this.generateListHostNames();
        return (
                <div className="configure-status-page-container">
                        <div className={`modal-saved ${showSaved ? 'modal-saved-show': 'modal-saved-hide'}`}>
                            Saved <Icon type={Icon.TYPE.PROFILES__EVENTS__LIKE} />
                        </div>
                        <HeadingText className="modal-list-title" type={HeadingText.TYPE.HEADING1}> Configure Status Pages</HeadingText>
                        <div className="modal-container">
                            <div className="modal-list-container">
                                <ul className="modal-list">
                                    {hostnames}
                                </ul>
                            </div>
                            {/* TODO: Make component */}
                            <div className="modal-text-add-container">
                                <div className="text-field-flex">
                                    <TextField className="add-host-name" onChange={this.onTextInputChange} label='Add new hostname' placeholder='e.g. https://status.newrelic.com/'/>
                                    <div className="add-status-page-config">
                                        <select className="btn-white"  onChange={this.onProviderChange} value={selectedProvider}>
                                            <option value="statusPageIo">
                                                Status Page Io
                                            </option>
                                            <option value="aws">
                                                Aws
                                            </option>
                                            <option value="google">
                                                Google
                                            </option>
                                        </select>
                                        <TagsModal
                                            addDepTypeCallback={this.addDepTypeCallback}
                                            hostName={selectedEditHost}
                                            hidden={tagHidden}
                                            onClose={this.onTagModalClose}/>
                                    </div>
                                </div>
                                <Button
                                    className="btn-white"
                                    onClick={this.addHostName}
                                    iconType={Button.ICON_TYPE.INTERFACE__SIGN__PLUS}
                                    tagType={Button.TAG_TYPE.BUTTON}>Add</Button>
                            </div>
                            {keyObject.type === 'account' &&
                                <Button className="modal-button"
                                    iconType={Button.ICON_TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__CLOUD}
                                    onClick={this.saveAll}>Sync All Accounts</Button> }
                            <Button className="modal-button"
                                    iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__EDIT}
                                    onClick={this.save}>Save</Button>
                        </div>
                </div>
        );
    }
}
