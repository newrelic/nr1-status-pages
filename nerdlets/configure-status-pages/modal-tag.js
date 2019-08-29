import React from 'react';
import { Button, HeadingText,  Modal, TextField } from 'nr1';

export default class TagsModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            addTagName: '',
            tagHidden: props.tagHidden,
            tags: []
        }
        this.addTag = this.addTag.bind(this);
        this.deleteTag = this.deleteTag.bind(this);
        this.onTextInputChange = this.onTextInputChange.bind(this);
    }

    addTag() {
        const {addTagName, tags} = this.state;
        tags.push(addTagName.toLowerCase());
        this.setState({'tags': tags});
    }

    deleteTag(tagName) {
        const {tags} = this.state;
        tags.splice(tags.findIndex(tag => tag === tagName), 1);
        this.setState({'tags': tags});
    }

    generateListHostNames() {
        if (!this.state.tags) return <div></div>
        return this.state.tags.map(tag => <li key={tag} className="modal-list-item">
            <div className="modal-list-item-name"> {tag} </div><Button className="btn-white modal-list-item-delete" iconType={Button.ICON_TYPE.INTERFACE__SIGN__TIMES} onClick={this.deleteTag.bind(this, tag)}></Button>
        </li>);
    }

    onTextInputChange(event) {
        this.setState({'addTagName': event.target.value});
    }

    render() {
        const {onClose, hidden} = this.props;
        const {tags} = this.state;
        return (
                <Modal
                    hidden={hidden}
                    onClose={onClose}>
                    <HeadingText className="modal-list-title" type={HeadingText.TYPE.HEADING3}> Add External Dependency Tags</HeadingText>
                    <ul className="modal-list">
                        {this.generateListHostNames()}
                    </ul>
                    <div className="modal-text-add-container">
                        <div className="text-field-flex">
                            <TextField onChange={this.onTextInputChange} label='Add Dependency Tag' placeholder='dyanmodb'/>
                        </div>
                        <Button
                            className="btn-white"
                            onClick={this.addTag}
                            iconType={Button.ICON_TYPE.INTERFACE__SIGN__PLUS}
                            tagType={Button.TAG_TYPE.BUTTON}>Add</Button>
                    </div>
                    <Button className="modal-button" onClick={onClose.bind(this, tags)}>Close</Button>
                </Modal>
        );
    }
}
