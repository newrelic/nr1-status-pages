import React, { useCallback, useReducer } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField } from 'nr1';

const NRQL_PROVIDER_NAME = 'nrql';
const WORKLOAD_PROVIDER_NAME = 'workload';
const STATUSPAL_PROVIDER_NAME = 'statusPal';

const formInit = (hostname) => ({
  serviceName: hostname.serviceName,
  hostName: hostname.hostName,
  nrqlQuery: hostname.nrqlQuery,
  workloadGuid: hostname.workloadGuid,
  subDomain: hostname.subDomain,
  provider: hostname.provider,
  hostLogo: hostname.hostLogo,
  id: hostname.id,
});

const formReducer = (state, action) => {
  if (action.type === 'setField') {
    return { ...state, [action.field]: action.value };
  }
  return state;
};

const ServiceSettingsForm = ({ hostname, contentRef, onSave, onDelete }) => {
  const [form, dispatchForm] = useReducer(formReducer, hostname, formInit);

  const setField = useCallback(
    (field, value) => dispatchForm({ type: 'setField', field, value }),
    []
  );

  const handleDeleteClick = useCallback(
    (e) => {
      e.stopPropagation();
      onDelete();
    },
    [onDelete]
  );

  const handleSaveClick = useCallback(
    (e) => {
      e.stopPropagation();
      onSave({
        serviceName: form.serviceName,
        hostName: form.hostName,
        provider: form.provider,
        hostLogo: form.hostLogo,
        nrqlQuery: form.nrqlQuery,
        workloadGuid: form.workloadGuid,
        subDomain: form.subDomain,
        id: form.id,
      });
    },
    [form, onSave]
  );

  const renderProviderSetting = () => {
    if (hostname.provider === NRQL_PROVIDER_NAME) {
      return (
        <TextField
          label="NRQL"
          placeholder="Put your NRQL query here"
          className="status-page-setting"
          onChange={(e) => setField('nrqlQuery', e.target.value)}
          defaultValue={hostname.nrqlQuery}
        />
      );
    } else if (hostname.provider === WORKLOAD_PROVIDER_NAME) {
      return (
        <TextField
          label="Workload"
          placeholder="Put your Workload entity guid here"
          className="status-page-setting"
          onChange={(e) => setField('workloadGuid', e.target.value)}
          defaultValue={hostname.workloadGuid}
        />
      );
    } else if (hostname.provider === STATUSPAL_PROVIDER_NAME) {
      return (
        <TextField
          label="Subdomain"
          placeholder="myservice.com"
          className="status-page-setting"
          onChange={(e) => setField('subDomain', e.target.value)}
          defaultValue={hostname.subDomain}
        />
      );
    }
    return (
      <TextField
        label="Hostname"
        placeholder="https://status.myservice.com/"
        className="status-page-setting"
        onChange={(e) => setField('hostName', e.target.value)}
        defaultValue={hostname.hostName}
      />
    );
  };

  return (
    <div className="status-page-settings-container" ref={contentRef}>
      <div className="status-page-settings-content">
        <TextField
          label="Service name"
          className="status-page-setting"
          onChange={(e) => setField('serviceName', e.target.value)}
          defaultValue={hostname.serviceName}
        />
        {renderProviderSetting()}
        <TextField
          label="Service logo"
          className="status-page-setting"
          onChange={(e) => setField('hostLogo', e.target.value)}
          defaultValue={hostname.hostLogo}
          placeholder="https://website.com/logo.png"
        />
      </div>
      <div className="status-page-settings-cta-container">
        <Button
          type={Button.TYPE.DESTRUCTIVE}
          onClick={handleDeleteClick}
          iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__TRASH}
        >
          Delete
        </Button>
        <Button type={Button.TYPE.PRIMARY} onClick={handleSaveClick}>
          Done
        </Button>
      </div>
    </div>
  );
};

ServiceSettingsForm.propTypes = {
  hostname: PropTypes.object.isRequired,
  contentRef: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ServiceSettingsForm;
