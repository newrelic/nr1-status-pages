import React from 'react';
import PropTypes from 'prop-types';

import { AccountStorageMutation, AccountStorageQuery, Button, Dropdown, DropdownItem, HeadingText, Icon, Modal, TextField } from 'nr1';

import AccountPicker from './account-picker';

const HOST_NAMES_COLLECTION_KEY = 'host_names_v0'
const HOST_NAMES_DOCUMENT_ID = 'host_names'
export default class Toolbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hidden: true,
            mounted: false,
            hostNames: []
        }
        this.addHostName = this.addHostName.bind(this);
        this.onEditStatusPageClick = this.onEditStatusPageClick.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.onModalHideEnd = this.onModalHideEnd.bind(this);
        this.onTextInputChange = this.onTextInputChange.bind(this);
        this.save = this.save.bind(this);
        this.deleteHost = this.deleteHost.bind(this);
    }

    addHostName() {
        const { addHostName} = this.state;
        const {hostNames} = this.props;
        hostNames.push(addHostName);
        this.props.hostNameCallBack(hostNames);
    }

    deleteHost(hostname) {
        const {hostNames} = this.props;
        hostNames.splice(hostNames.findIndex(val => val === hostname), 1);
        this.props.hostNameCallBack(hostNames);
    }

    // TODO: Move to nerd store
    generateListHostNames() {
        if (!this.props.hostNames) return <div></div>
        return this.props.hostNames.map(hostname => <li key={hostname} className="modal-list-item">
            <div className="modal-list-item-name"> {hostname} </div><Button className="btn-white modal-list-item-delete" iconType={Button.ICON_TYPE.INTERFACE__SIGN__TIMES} onClick={this.deleteHost.bind(this, hostname)}></Button>
        </li>);
    }

    async save() {
        const mutationProp = {
            accountId: this.props.selectedAccountId,
            actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
            collection: HOST_NAMES_COLLECTION_KEY,
            document: this.props.hostNames,
            documentId: HOST_NAMES_DOCUMENT_ID
        }
        console.log(mutationProp);
        const saveResults = await AccountStorageMutation.mutate(mutationProp);
        this.setState({'showSaved': true});
        setTimeout(()=> this.setState({'showSaved': false}), 2 * 1000);
    }

    onTextInputChange(event) {
        this.setState({'addHostName': event.target.value});
    }

    async onEditStatusPageClick() {
        this.setState({'hidden': false, 'mounted': true, 'showSaved': false});
    }

    // TODO: Revert any unsaved changes
    async onModalClose() {
        this.setState({'hidden': true});
    }

    onModalHideEnd() {
        this.setState({'mounted': false});
    }

    render() {
        const {onAccountSelected, refreshRateCallback, refreshRate} = this.props;
        const {hidden, mounted, showSaved} = this.state;
        const hostnames = this.generateListHostNames();
        return (
            <div className="toolbar-container">
                   <Dropdown className="toolbar-dropdown" title={`Refresh Rate: ${refreshRate}`}>
                        <DropdownItem onClick={refreshRateCallback}>2</DropdownItem>
                        <DropdownItem onClick={refreshRateCallback}>5</DropdownItem>
                        <DropdownItem onClick={refreshRateCallback}>10</DropdownItem>
                        <DropdownItem onClick={refreshRateCallback}>15</DropdownItem>
                        <DropdownItem onClick={refreshRateCallback}>20</DropdownItem>
                        <DropdownItem onClick={refreshRateCallback}>25</DropdownItem>
                    </Dropdown>
                    <AccountPicker accountChangedCallback={onAccountSelected}/>
                    <div className="dot-header">
                        <div className="dot-container"> <div className="dot minor"></div><div className="dot-name">Minor Incident</div></div>
                        <div className="dot-container"> <div className="dot major"></div><div className="dot-name">Major Incident</div></div>
                        <div className="dot-container"> <div className="dot critical"></div><div className="dot-name">Critcal Incident</div></div>
                    </div>
                    <Button
                        className="btn-toolbar"
                        onClick={this.onEditStatusPageClick}
                        tagType={Button.TAG_TYPE.BUTTON}>Edit StatusPages</Button>
                    {mounted &&
                        <Modal
                            hidden={hidden}
                            onClose={this.onModalClose}
                            onHideEnd={this.onModalHideEnd}>
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
                                    <Button className="modal-button" onClick={this.onModalClose}>Close</Button>
                                </div>
                        </Modal>
                    }
            </div>
        );
    }
}
