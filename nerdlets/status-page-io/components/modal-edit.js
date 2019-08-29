import React from 'react';
import PropTypes from 'prop-types';

import { Button, HeadingText, Icon, Modal, TextField } from 'nr1';

import { getHostNamesFromNerdStorage, saveHostNamesToNerdStorage } from '../utilities/nerdlet-storage';

export default class EditModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hidden: true,
            mounted: false,
            unSavedChanges: [],
            selectedProvider: 'statusPageIo'
        }
        this.addHostName = this.addHostName.bind(this);
        this.onEditStatusPageClick = this.onEditStatusPageClick.bind(this);
        this.onTextInputChange = this.onTextInputChange.bind(this);
        this.save = this.save.bind(this);
        this.saveAll = this.saveAll.bind(this);
        this.deleteHost = this.deleteHost.bind(this);
        this.onProviderChange = this.onProviderChange.bind(this);
    }

    async componentDidMount() {
        const {keyObject} = this.props;

        const unSavedChanges = await getHostNamesFromNerdStorage(keyObject);
        this.setState({'unSavedChanges': unSavedChanges});
    }

    addHostName() {
        const {addHostName, selectedProvider, unSavedChanges} = this.state;
        unSavedChanges.push({
            hostName: addHostName,
            provider: selectedProvider
        });
        this.setState({'unSavedChanges': unSavedChanges});
        console.debug(unSavedChanges);

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
            <div className="modal-list-item-name"> {hostNameObject.hostName} </div><Button className="btn-white modal-list-item-delete" iconType={Button.ICON_TYPE.INTERFACE__SIGN__TIMES} onClick={this.deleteHost.bind(this, hostNameObject.hostName)}></Button>
        </li>);
    }

    _displaySaveMessage() {
        this.setState({'showSaved': true});
        this.props.hostNameCallBack(this.state.unSavedChanges)
        setTimeout(()=> this.setState({'showSaved': false}), 2 * 1000);
    }

    async save() {
        await saveHostNamesToNerdStorage(this.props.keyObject, this.state.unSavedChanges);
        this._displaySaveMessage();
    }

    async saveAll() {
        try {
            this.props.accounts.forEach(async account=> await saveHostNamesToNerdStorage({key: account.id, type: 'account'}, this.state.unSavedChanges) );
            this._displaySaveMessage();
        } catch(err) {
            console.log(err);
        }
    }

    onTextInputChange(event) {
        this.setState({'addHostName': event.target.value});
    }

    async onEditStatusPageClick() {
        this.setState({'hidden': false, 'mounted': true, 'showSaved': false});
    }

    onProviderChange(event) {
        this.setState({'selectedProvider': event.target.value})
    }



    render() {
        const {keyObject, hidden, onModalClose, onModalHideEnd} = this.props;
        const {showSaved, selectedProvider} = this.state;
        const hostnames = this.generateListHostNames();
        return (
                <Modal
                    hidden={hidden}
                    onClose={onModalClose}
                    onHideEnd={onModalHideEnd}>
                        <div className={`modal-saved ${showSaved ? 'modal-saved-show': 'modal-saved-hide'}`}>
                            Saved <Icon type={Icon.TYPE.PROFILES__EVENTS__LIKE} />
                        </div>
                        <div className="modal-container">
                            <div className="modal-list-container">
                                <HeadingText className="modal-list-title" type={HeadingText.TYPE.HEADING3}> Status Pages</HeadingText>
                                <ul className="modal-list">
                                    {hostnames}
                                </ul>
                            </div>
                            <div className="modal-text-add-container">
                                <TextField onChange={this.onTextInputChange} className="text-field-flex" label='Add new hostname' placeholder='e.g. https://status.newrelic.com/'/>
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
                            <Button className="modal-button" onClick={onModalClose}>Close</Button>
                        </div>
                </Modal>
        );
    }
}
