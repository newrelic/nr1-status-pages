import React from 'react';
import PropTypes from 'prop-types';

import { AccountStorageMutation, AccountStorageQuery, Button, Dropdown, DropdownItem, HeadingText, Icon, Modal, TextField } from 'nr1';

import EditModal from './modal-edit';

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
        this.onEditStatusPageClick = this.onEditStatusPageClick.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.onModalHideEnd = this.onModalHideEnd.bind(this);
    }

    addHostName() {
        const { addHostName} = this.state;
        const {hostNames} = this.props;
        hostNames.push(addHostName);
        this.props.hostNameCallBack(hostNames);
    }

    async onEditStatusPageClick() {
        this.setState({'hidden': false, 'mounted': true, 'showSaved': false});
    }

    onModalClose() {
        this.setState({'hidden': true});
    }

    onModalHideEnd() {
        this.setState({'mounted': false});
    }

    render() {
        const {hostNameCallBack, onAccountSelected, refreshRateCallback, refreshRate, selectedAccountId} = this.props;
        const {hidden, hostNames, mounted} = this.state;
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
                        <EditModal hostNameCallBack={hostNameCallBack} accountId={selectedAccountId} hostNames={hostNames} hidden={hidden} onModalClose={this.onModalClose} onModalHideEnd={this.onModalHideEnd}/>
                    }
            </div>
        );
    }
}
