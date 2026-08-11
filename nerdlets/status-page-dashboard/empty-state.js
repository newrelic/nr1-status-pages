import React from 'react';
import PropTypes from 'prop-types';
import { AccountPicker, HeadingText, Button } from 'nr1';

const EmptyState = ({
  entityGuidExists,
  selectedAccountId,
  onAccountSelected,
  onCreateClick,
}) => (
  <div className="status-container no-status-pages-found">
    <div className="no-status-pages" style={{ gridColumn: '2 / 4' }}>
      <HeadingText
        className="no-status-pages-header"
        type={HeadingText.TYPE.HEADING_2}
      >
        Get started
      </HeadingText>

      <p className="no-status-pages-description">
        {!entityGuidExists && 'Select an account below to get started. Then,'}
        {entityGuidExists && 'To get started,'} click the &quot;Add a new
        service&quot; button below to add it to the list of services who&apos;s
        statuses you can view and track on this page.
      </p>

      {!entityGuidExists && (
        <AccountPicker value={selectedAccountId} onChange={onAccountSelected} />
      )}

      <Button
        style={{ marginTop: '8px' }}
        type={Button.TYPE.PRIMARY}
        iconType={Button.ICON_TYPE.INTERFACE__SIGN__PLUS}
        sizeType={Button.SIZE_TYPE.LARGE}
        onClick={onCreateClick}
      >
        Add new service
      </Button>
    </div>
  </div>
);

EmptyState.propTypes = {
  entityGuidExists: PropTypes.bool.isRequired,
  selectedAccountId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onAccountSelected: PropTypes.func.isRequired,
  onCreateClick: PropTypes.func.isRequired,
};

export default EmptyState;
