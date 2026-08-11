import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'nr1';

import TextFieldWrapper from './TextFieldWrapper/TextFieldWrapper';

const PROVIDERS = {
  STATUS_PAGE: { value: 'statusPageIo', label: 'Status Page' },
  GOOGLE: { value: 'google', label: 'Google' },
  STATUS_IO: { value: 'statusIo', label: 'Status Io' },
  NRQL: { value: 'nrql', label: 'NRQL' },
  WORKLOAD: { value: 'workload', label: 'Workload' },
  RSS: { value: 'rss', label: 'RSS Feed' },
  STATUS_PAL: { value: 'statusPal', label: 'Statuspal' },
  APPLE: { value: 'apple', label: 'Apple System Status' },
  AWS_HEALTH: { value: 'awsHealth', label: 'AWS Health' },
  AZURE: { value: 'azure', label: 'Azure' },
  OCI: { value: 'oci', label: 'Oracle Cloud Infrastructure' },
};

const renderProviderInput = (formInputs, onUpdateInputValue) => {
  const { providerName, hostName, nrqlQuery, workloadGuid, subDomain } =
    formInputs;

  if (providerName.inputValue === PROVIDERS.NRQL.value) {
    return (
      <TextFieldWrapper
        label="NRQL"
        placeholder="Put your NRQL query here"
        onChange={(e) => onUpdateInputValue(e, 'nrqlQuery')}
        value={nrqlQuery.inputValue}
        validationText={nrqlQuery.validationText}
      />
    );
  } else if (providerName.inputValue === PROVIDERS.WORKLOAD.value) {
    return (
      <TextFieldWrapper
        label="Workload Guid"
        placeholder="Put your Workload Entity guid here"
        onChange={(e) => onUpdateInputValue(e, 'workloadGuid')}
        value={workloadGuid.inputValue}
        validationText={workloadGuid.validationText}
      />
    );
  } else if (providerName.inputValue === PROVIDERS.STATUS_PAL.value) {
    return (
      <TextFieldWrapper
        label="Subdomain"
        placeholder="Put your Statuspal subdomain here"
        onChange={(e) => onUpdateInputValue(e, 'subDomain')}
        value={subDomain.inputValue}
        validationText={subDomain.validationText}
      />
    );
  }
  return (
    <TextFieldWrapper
      label="Hostname"
      placeholder="https://status.myservice.com/"
      onChange={(e) => onUpdateInputValue(e, 'hostName')}
      value={hostName.inputValue}
      validationText={hostName.validationText}
    />
  );
};

const CreateServiceFields = ({
  formInputs,
  hostRequiresProxy,
  selectedPopularSiteIndex,
  onQuickSetupSelect,
  onCORSChange,
  onProviderChange,
  onUpdateInputValue,
}) => {
  const { serviceName, providerName, logoUrl, corsProxyAddress } = formInputs;

  return (
    <>
      <div className="select-container">
        <label htmlFor="quick-setup-select">Quick setup</label>
        <select
          id="quick-setup-select"
          value={selectedPopularSiteIndex}
          onChange={onQuickSetupSelect}
        >
          <option value="">Choose a service</option>
          <option value="0">Google Cloud</option>
          <option value="1">GitHub</option>
          <option value="2">Jira</option>
          <option value="3">New Relic</option>
          <option value="4">Ezidebit</option>
          <option value="5">Apple Developer</option>
          <option value="6">AWS</option>
          <option value="7">Azure</option>
          <option value="8">Microsoft 365</option>
          <option value="9">Okta</option>
          <option value="10">Oracle Cloud Infrastructure</option>
        </select>
      </div>

      <hr className="or-sep" />

      <div className="select-container">
        <Checkbox onChange={onCORSChange} label="Host requires CORS proxy" />
      </div>
      {hostRequiresProxy && (
        <div className="select-container">
          <TextFieldWrapper
            label="CORS proxy address"
            onChange={(e) => onUpdateInputValue(e, 'corsProxyAddress')}
            value={corsProxyAddress.inputValue}
            validationText={corsProxyAddress.validationText}
          />
        </div>
      )}

      <div className="select-container">
        <label htmlFor="provider-select">Provider</label>
        <select
          id="provider-select"
          onChange={onProviderChange}
          value={providerName.inputValue}
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
      />

      {renderProviderInput(formInputs, onUpdateInputValue)}

      <TextFieldWrapper
        label="Service logo (url)"
        onChange={(e) => onUpdateInputValue(e, 'logoUrl')}
        value={logoUrl.inputValue}
        validationText={logoUrl.validationText}
        placeholder="https://myservice.com/logo.png"
      />
    </>
  );
};

CreateServiceFields.propTypes = {
  formInputs: PropTypes.object.isRequired,
  hostRequiresProxy: PropTypes.bool,
  selectedPopularSiteIndex: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onQuickSetupSelect: PropTypes.func.isRequired,
  onCORSChange: PropTypes.func.isRequired,
  onProviderChange: PropTypes.func.isRequired,
  onUpdateInputValue: PropTypes.func.isRequired,
};

export default CreateServiceFields;
