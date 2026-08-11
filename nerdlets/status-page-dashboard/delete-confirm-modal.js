import React from 'react';
import PropTypes from 'prop-types';
import { Modal, HeadingText, Button } from 'nr1';

const DeleteConfirmModal = ({ hidden, onCancel, onConfirm }) => (
  <Modal hidden={hidden} onClose={onCancel}>
    <HeadingText className="modal-heading" type={HeadingText.TYPE.HEADING_2}>
      Are you sure you want to delete this service?
    </HeadingText>
    <p className="modal-paragraph">
      This cannot be undone. Please confirm whether or not you want to delete
      this service from your status pages.
    </p>

    <Button
      className="modal-button"
      type={Button.TYPE.PRIMARY}
      onClick={onCancel}
    >
      Cancel
    </Button>
    <Button
      className="modal-button"
      type={Button.TYPE.DESTRUCTIVE}
      onClick={onConfirm}
      iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__TRASH}
    >
      Delete
    </Button>
  </Modal>
);

DeleteConfirmModal.propTypes = {
  hidden: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default DeleteConfirmModal;
