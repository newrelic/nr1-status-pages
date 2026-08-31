import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Icon, Tooltip } from 'nr1';

import TextFieldWrapper from './TextFieldWrapper/TextFieldWrapper';
import {
  PROVIDERS,
  PROVIDER_FIELD_CONFIG,
  DEFAULT_LOCATION_FIELD,
} from './providers';

const renderProviderInput = (formInputs, onUpdateInputValue, disabled) => {
  const { providerName } = formInputs;
  const { key, label, placeholder } =
    PROVIDER_FIELD_CONFIG[providerName.inputValue] || DEFAULT_LOCATION_FIELD;
  const field = formInputs[key];

  return (
    <TextFieldWrapper
      label={label}
      placeholder={placeholder}
      onChange={(e) => onUpdateInputValue(e, key)}
      value={field.inputValue}
      validationText={field.validationText}
      disabled={disabled}
    />
  );
};

const CreateServiceFields = ({
  formInputs,
  hostRequiresProxy,
  isManualSetup,
  disabled,
  onCORSChange,
  onProviderChange,
  onUpdateInputValue,
}) => {
  const { serviceName, providerName, logoUrl, corsProxyAddress } = formInputs;

  const tooltipLink = {
    label: 'Learn more',
    to: 'https://github.com/newrelic/nr1-status-pages/blob/main/README.md#cors-configuration',
  };

  return (
    <>
      {isManualSetup && (
        <>
          <div className="select-container">
            <Checkbox
              onChange={onCORSChange}
              label="Host requires CORS proxy"
              disabled={disabled}
            />
            <Tooltip
              text="Optional proxy to route status page requests through"
              additionalInfoLink={tooltipLink}
              placementType={Tooltip.PLACEMENT_TYPE.TOP}
            >
              <Icon className="cors-tooltip" type="INTERFACE__INFO__HELP" />
            </Tooltip>
          </div>
          {hostRequiresProxy && (
            <div className="select-container">
              <TextFieldWrapper
                label="CORS proxy address"
                onChange={(e) => onUpdateInputValue(e, 'corsProxyAddress')}
                value={corsProxyAddress.inputValue}
                validationText={corsProxyAddress.validationText}
                disabled={disabled}
              />
            </div>
          )}
        </>
      )}

      <div className="select-container">
        <label htmlFor="provider-select">Provider</label>
        <select
          id="provider-select"
          onChange={onProviderChange}
          value={providerName.inputValue}
          disabled={disabled}
        >
          <option value="">Choose a provider</option>
          {Object.values(PROVIDERS).map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {providerName.validationText && (
        <p className="text-field__validation">{providerName.validationText}</p>
      )}

      <TextFieldWrapper
        label="Service name"
        onChange={(e) => onUpdateInputValue(e, 'serviceName')}
        value={serviceName.inputValue}
        validationText={serviceName.validationText}
        disabled={disabled}
      />

      {renderProviderInput(formInputs, onUpdateInputValue, disabled)}

      <TextFieldWrapper
        label="Service logo (url)"
        onChange={(e) => onUpdateInputValue(e, 'logoUrl')}
        value={logoUrl.inputValue}
        validationText={logoUrl.validationText}
        placeholder="https://myservice.com/logo.png"
        disabled={disabled}
      />
    </>
  );
};

CreateServiceFields.propTypes = {
  formInputs: PropTypes.object.isRequired,
  hostRequiresProxy: PropTypes.bool,
  isManualSetup: PropTypes.bool,
  disabled: PropTypes.bool,
  onCORSChange: PropTypes.func.isRequired,
  onProviderChange: PropTypes.func.isRequired,
  onUpdateInputValue: PropTypes.func.isRequired,
};

export default CreateServiceFields;
