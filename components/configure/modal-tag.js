import React from 'react';
import PropTypes from 'prop-types';
import { Button, HeadingText, Modal, TextField, Stack, StackItem } from 'nr1';

export default class TagsModal extends React.PureComponent {
  static propTypes = {
    hostName: PropTypes.string,
    hidden: PropTypes.bool,
    onClose: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      addTagName: '',
      tags: props.hostName ? props.hostName.tags : []
    };
    this.addTag = this.addTag.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
    this.onTextInputChange = this.onTextInputChange.bind(this);
  }

  addTag() {
    const { addTagName, tags } = this.state;
    tags.push(addTagName.toLowerCase());
    if (!this.props.hostName.tags) this.props.hostName.tags = [];
    this.props.hostName.tags.push(addTagName);
    this.setState({ tags: tags });
  }

  deleteTag(tagName) {
    const { tags } = this.state;
    this.props.hostName.tags.splice(
      this.props.hostName.tags.findIndex(tag => tag === tagName),
      1
    );
    tags.splice(
      tags.findIndex(tag => tag === tagName),
      1
    );
    this.setState({ tags: tags });
  }

  generateListHostNames() {
    if (!this.props.hostName || !this.props.hostName.tags) return <div />;
    return this.props.hostName.tags.map(tag => (
      <li key={tag} className="modal-list-item">
        <div className="modal-list-item-name"> {tag} </div>
        <Button
          className="btn-white modal-list-item-delete"
          iconType={Button.ICON_TYPE.INTERFACE__SIGN__TIMES}
          onClick={() => {
            this.deleteTag(tag);
          }}
        />
      </li>
    ));
  }

  onTextInputChange(event) {
    this.setState({ addTagName: event.target.value });
  }

  render() {
    const { onClose, hidden } = this.props;
    const { tags } = this.state;
    return (
      <Modal hidden={hidden} onClose={onClose}>
        <div className="tag-container">
          <HeadingText
            type={HeadingText.TYPE.HEADING_4}
            className="add-dependancy-heading"
          >
            {' '}
            Add External Dependency Tags
          </HeadingText>
          <ul className="modal-list">{this.generateListHostNames()}</ul>
          <TextField
            onChange={this.onTextInputChange}
            label="Add Dependency Tag"
            placeholder="dyanmodb"
          />
          <Stack
            className="modal-text-add-container"
            verticalType={Stack.VERTICAL_TYPE.TRAILING}
            horizontalType={Stack.HORIZONTAL_TYPE.TRAILING}
          >
            <StackItem>
              <Button
                type={Button.TYPE.TERTIARY}
                onClick={() => {
                  onClose(tags);
                }}
              >
                Close
              </Button>
            </StackItem>
            <StackItem>
              <Button
                onClick={this.addTag}
                type={Button.TYPE.PRIMARY}
                iconType={Button.ICON_TYPE.INTERFACE__SIGN__PLUS}
              >
                Add
              </Button>
            </StackItem>
          </Stack>
        </div>
      </Modal>
    );
  }
}
