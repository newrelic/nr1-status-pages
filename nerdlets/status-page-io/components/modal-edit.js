import React from 'react';
import PropTypes from 'prop-types';

import { AccountStorageMutation, AccountStorageQuery, Button, Dropdown, DropdownItem, HeadingText, Icon, Modal, TextField } from 'nr1';

import AccountNerdletStorage from '../utilities/nerdlet-storage';

const HOST_NAMES_COLLECTION_KEY = 'host_names_v0'
const HOST_NAMES_DOCUMENT_ID = 'host_names'
export default class EditModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hidden: true,
            mounted: false,
            unSavedChanges: []
        }
        this.addHostName = this.addHostName.bind(this);
        this.onEditStatusPageClick = this.onEditStatusPageClick.bind(this);
        this.onTextInputChange = this.onTextInputChange.bind(this);
        this.save = this.save.bind(this);
        this.deleteHost = this.deleteHost.bind(this);
    }

    async componentDidMount() {
        console.debug(this.props);
        const unSavedChanges = await new AccountNerdletStorage().getStatusPageIoHostNames(this.props.accountId);
        this.setState({'unSavedChanges': unSavedChanges});
    }

    addHostName() {
        const {addHostName, unSavedChanges} = this.state;
        unSavedChanges.push(addHostName);
        this.setState({'unSavedChanges': unSavedChanges});

    }

    deleteHost(hostname) {
        const {unSavedChanges} = this.state;
        unSavedChanges.splice(unSavedChanges.findIndex(val => val === hostname), 1);
        this.setState({'unSavedChanges': unSavedChanges});
    }

    // TODO: Move to nerd store
    generateListHostNames() {
        if (!this.state.unSavedChanges) return <div></div>
        return this.state.unSavedChanges.map(hostname => <li key={hostname} className="modal-list-item">
            <div className="modal-list-item-name"> {hostname} </div><Button className="btn-white modal-list-item-delete" iconType={Button.ICON_TYPE.INTERFACE__SIGN__TIMES} onClick={this.deleteHost.bind(this, hostname)}></Button>
        </li>);
    }

    async save() {
        const mutationProp = {
            accountId: this.props.accountId,
            actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
            collection: HOST_NAMES_COLLECTION_KEY,
            document: this.state.unSavedChanges,
            documentId: HOST_NAMES_DOCUMENT_ID
        }
        const saveResults = await AccountStorageMutation.mutate(mutationProp);
        this.setState({'showSaved': true});
        this.props.hostNameCallBack(this.state.unSavedChanges)
        setTimeout(()=> this.setState({'showSaved': false}), 2 * 1000);
    }

    async saveAll() {
        
    }

    onTextInputChange(event) {
        this.setState({'addHostName': event.target.value});
    }

    async onEditStatusPageClick() {
        this.setState({'hidden': false, 'mounted': true, 'showSaved': false});
    }

    render() {
        const {hidden, onModalClose, onModalHideEnd} = this.props;
        const {showSaved} = this.state;
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
                                <Button
                                    className="btn-white"
                                    onClick={this.addHostName}
                                    iconType={Button.ICON_TYPE.INTERFACE__SIGN__PLUS}
                                    tagType={Button.TAG_TYPE.BUTTON}>Add</Button>
                            </div>
                            <Button className="modal-button"
                                    iconType={Button.ICON_TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__CLOUD}
                                    onClick={this.save}>Sync All Accounts</Button>
                            <Button className="modal-button"
                                    iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__EDIT}
                                    onClick={this.save}>Save</Button>
                            <Button className="modal-button" onClick={onModalClose}>Close</Button>
                        </div>
                </Modal>
        );
    }
}
