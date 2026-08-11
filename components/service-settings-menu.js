import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'nr1';

const ServiceSettingsMenu = ({ onEdit, onDelete }) => {
  const [settingsPopoverActive, setSettingsPopoverActive] = useState(false);
  const popupHoverTimer = useRef(null);

  useEffect(() => {
    return () => clearTimeout(popupHoverTimer.current);
  }, []);

  const handleSettingsPopover = useCallback((e) => {
    setSettingsPopoverActive((v) => !v);
    if (e) e.stopPropagation();
  }, []);

  const handleEditClick = useCallback(
    (e) => {
      e.stopPropagation();
      onEdit();
      setSettingsPopoverActive(false);
    },
    [onEdit]
  );

  const handleDeleteClick = useCallback(
    (e) => {
      e.stopPropagation();
      onDelete();
      setSettingsPopoverActive(false);
    },
    [onDelete]
  );

  const handleSettingsButtonMouseLeave = useCallback(() => {
    popupHoverTimer.current = setTimeout(
      () => setSettingsPopoverActive(false),
      150
    );
  }, []);

  const handlePopupMouseEnter = useCallback(() => {
    if (popupHoverTimer.current) clearTimeout(popupHoverTimer.current);
  }, []);

  const handlePopupMouseLeave = useCallback(() => {
    popupHoverTimer.current = setTimeout(
      () => setSettingsPopoverActive(false),
      150
    );
  }, []);

  return (
    <div
      className={`service-settings-button-container ${
        settingsPopoverActive
          ? 'settings-popover-active'
          : 'settings-popover-inactive'
      }`}
      onMouseLeave={handleSettingsButtonMouseLeave}
    >
      <Button
        sizeType={Button.SIZE_TYPE.SMALL}
        className="service-settings-button"
        type={Button.TYPE.TERTIARY}
        iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__MORE}
        onClick={handleSettingsPopover}
      />
      <ul
        className="service-settings-dropdown"
        onMouseEnter={handlePopupMouseEnter}
        onMouseLeave={handlePopupMouseLeave}
      >
        <li className="service-settings-dropdown-item">
          <button
            type="button"
            className="service-settings-dropdown-item-button"
            onClick={handleEditClick}
          >
            <Icon type={Icon.TYPE.INTERFACE__OPERATIONS__EDIT} />
            Edit
          </button>
        </li>
        <li className="service-settings-dropdown-item destructive">
          <button
            type="button"
            className="service-settings-dropdown-item-button"
            onClick={handleDeleteClick}
          >
            <Icon
              type={Icon.TYPE.INTERFACE__OPERATIONS__TRASH}
              color="#BF0016"
            />
            Delete
          </button>
        </li>
      </ul>
    </div>
  );
};

ServiceSettingsMenu.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ServiceSettingsMenu;
