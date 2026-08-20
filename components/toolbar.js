import React from 'react';
import PropTypes from 'prop-types';
import { AccountPicker, Button, Stack, StackItem, TextField } from 'nr1';

const Toolbar = ({
  entityGuid,
  onAccountSelected,
  selectedAccountId,
  setSearchQuery,
  handleCreateTileModal,
}) => {
  const entityGuidExists = entityGuid !== null && entityGuid !== undefined;

  return (
    <Stack
      className="toolbar-container"
      fullWidth
      horizontalType={Stack.HORIZONTAL_TYPE.FILL}
      verticalType={Stack.VERTICAL_TYPE.CENTER}
      gapType={Stack.GAP_TYPE.NONE}
    >
      <StackItem className="toolbar-left-side">
        {!entityGuidExists && (
          <>
            <AccountPicker
              className="toolbar-component"
              disabled={entityGuidExists}
              onChange={onAccountSelected}
              value={selectedAccountId}
            />
          </>
        )}

        <div>
          <TextField
            className="toolbar-search"
            type="search"
            name="search"
            placeholder="Search by service name"
            onChange={setSearchQuery}
          />
        </div>
      </StackItem>
      <StackItem>
        <Stack
          className="toolbar-right-side"
          fullWidth
          horizontalType={Stack.HORIZONTAL_TYPE.RIGHT}
        >
          <Button
            type={Button.TYPE.PRIMARY}
            iconType={Button.ICON_TYPE.INTERFACE__SIGN__PLUS}
            sizeType={Button.SIZE_TYPE.MEDIUM}
            onClick={handleCreateTileModal}
          >
            Add new service
          </Button>
        </Stack>
      </StackItem>
    </Stack>
  );
};

Toolbar.propTypes = {
  entityGuid: PropTypes.string,
  onAccountSelected: PropTypes.func,
  selectedAccountId: PropTypes.number,
  setSearchQuery: PropTypes.func,
  handleCreateTileModal: PropTypes.func,
};

export default Toolbar;
