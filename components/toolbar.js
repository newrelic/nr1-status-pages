import React from 'react';
import PropTypes from 'prop-types';

import {  Button, Dropdown, DropdownItem , navigation} from 'nr1';


import AccountPicker from './account-picker';
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

    async onEditStatusPageClick() {
        const nerdletWithState = {
            id: '1a1659b2-96c0-4e13-9334-fba5438fa6e3.configure-status-pages',
            urlState: {
                accounts: this.props.accounts,
                accountId: this.props.selectedAccountId,
                entityGuid: this.props.entityGuid
            }
        };
        navigation.openStackedNerdlet(nerdletWithState);
    }

    onModalClose() {
        this.setState({'hidden': true});
    }

    onModalHideEnd() {
        this.setState({'mounted': false});
    }

    render() {
        const {entityGuid, onAccountSelected, refreshRateCallback, refreshRate} = this.props;
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
                    {!entityGuid && <AccountPicker accountChangedCallback={onAccountSelected}/>}
                    <div className="dot-header">
                        <div className="dot-container"> <div className="dot minor"></div><div className="dot-name">Minor Incident</div></div>
                        <div className="dot-container"> <div className="dot major"></div><div className="dot-name">Major Incident</div></div>
                        <div className="dot-container"> <div className="dot critical"></div><div className="dot-name">Critical Incident</div></div>
                    </div>
                    <Button
                        className="btn-toolbar"
                        onClick={this.onEditStatusPageClick}
                        >Edit StatusPages</Button>
            </div>
        );
    }
}
