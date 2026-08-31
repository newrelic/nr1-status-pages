import React from 'react';
import PropTypes from 'prop-types';

import {
  PROVIDERS,
  PROVIDER_FIELD_CONFIG,
  DEFAULT_LOCATION_FIELD,
} from './providers';

const getProviderLabel = (providerValue) => {
  const match = Object.values(PROVIDERS).find(
    ({ value }) => value === providerValue
  );
  return match ? match.label : providerValue;
};

const getLocationRow = (formInputs) => {
  const { providerName } = formInputs;
  const { key, label } =
    PROVIDER_FIELD_CONFIG[providerName.inputValue] || DEFAULT_LOCATION_FIELD;
  return { label, value: formInputs[key]?.inputValue };
};

const getReviewRows = (formInputs, hostRequiresProxy) => {
  const { serviceName, providerName, logoUrl, corsProxyAddress } = formInputs;

  const rows = [
    { label: 'Service name', value: serviceName.inputValue },
    { label: 'Provider', value: getProviderLabel(providerName.inputValue) },
    getLocationRow(formInputs),
    { label: 'Service logo', value: logoUrl?.inputValue },
  ];

  if (hostRequiresProxy && corsProxyAddress) {
    rows.push({
      label: 'CORS proxy address',
      value: corsProxyAddress.inputValue,
    });
  }

  return rows.filter((row) => row.value);
};

const CreateServiceReview = ({ formInputs, hostRequiresProxy }) => {
  const rows = getReviewRows(formInputs, hostRequiresProxy);

  return (
    <div className="wizard-review">
      {rows.map(({ label, value }) => (
        <div className="wizard-review-row" key={label}>
          <span className="wizard-review-label">{label}</span>
          <span className="wizard-review-value">{value}</span>
        </div>
      ))}
    </div>
  );
};

CreateServiceReview.propTypes = {
  formInputs: PropTypes.object.isRequired,
  hostRequiresProxy: PropTypes.bool,
};

export default CreateServiceReview;
