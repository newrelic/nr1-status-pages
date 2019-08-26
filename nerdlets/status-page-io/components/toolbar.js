import React from 'react';
import PropTypes from 'prop-types';

import { Button, Dropdown, DropdownItem, Modal } from 'nr1';

export default class Toolbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hidden: true,
            mounted: false
        }
        this.onEditStatusPageClick = this.onEditStatusPageClick.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.onModalHideEnd = this.onModalHideEnd.bind(this);
    }

    onEditStatusPageClick() {
        this.setState({'hidden': false, 'mounted': true});
    }

    onModalClose() {
        this.setState({'hidden': true});
    }

    onModalHideEnd() {
        this.setState({'mounted': false});
    }

    render() {
        const {refreshRateCallback} = this.props;
        const {hidden, mounted} = this.state;
        return (
            <div className="toolbar-container">
                   <Dropdown className="toolbar-dropdown" title="RefreshRate">
                        <DropdownItem onClick={refreshRateCallback}>2</DropdownItem>
                        <DropdownItem onClick={refreshRateCallback}>5</DropdownItem>
                        <DropdownItem onClick={refreshRateCallback}>10</DropdownItem>
                        <DropdownItem onClick={refreshRateCallback}>15</DropdownItem>
                        <DropdownItem onClick={refreshRateCallback}>20</DropdownItem>
                        <DropdownItem onClick={refreshRateCallback}>25</DropdownItem>
                    </Dropdown>
                    <Button
                        className="btn-white"
                        onClick={this.onEditStatusPageClick}
                        tagType={Button.TAG_TYPE.BUTTON}>Edit StatusPages</Button>
                    {mounted &&
                        <Modal
                            hidden={hidden}
                            onClose={this.onModalClose}
                            onHideEnd={this.onModalHideEnd}>
                                Hi! :D 
                        </Modal>
                    }
            </div>
        );
    }
}
