import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import { HeadingText, Modal, Button } from 'nr1';

import CreateServiceFields from './create-service-fields';
import { popularSites } from '../../popular-status-pages';
import { isAllowedAppleUrl } from '../../utilities/apple-helper';
import { PROXY_BASE } from '../../utilities/proxy';

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

const emptyInputState = { inputValue: '', validationText: '' };

const initialFormInputs = () => ({
  serviceName: { ...emptyInputState },
  hostName: { ...emptyInputState },
  providerName: { ...emptyInputState },
  nrqlQuery: { ...emptyInputState },
  workloadGuid: { ...emptyInputState },
  logoUrl: { ...emptyInputState },
});

const validateServiceForm = (formInputs) => {
  let isFormValid = true;
  const genericValidationError = 'Please fill this field before saving.';

  const updated = { ...formInputs };
  const inputsList = Object.keys(updated).filter((k) => k !== 'logoUrl');
  for (const inputName of inputsList) {
    if (updated[inputName].inputValue.length < 2) {
      updated[inputName] = {
        ...updated[inputName],
        validationText: genericValidationError,
      };
      isFormValid = false;
    } else {
      updated[inputName] = { ...updated[inputName], validationText: '' };
    }
  }

  const { corsProxyAddress, nrqlQuery, workloadGuid, providerName, hostName } =
    updated;

  if (corsProxyAddress && corsProxyAddress.inputValue) {
    if (!corsProxyAddress.inputValue.includes('{url}')) {
      isFormValid = false;
      updated.corsProxyAddress = {
        ...corsProxyAddress,
        validationText:
          "CORS address must contain '{url}' that will be replaced with hostname",
      };
    }
  }

  if (workloadGuid && workloadGuid.inputValue) {
    if (/[\s,]/g.test(workloadGuid.inputValue)) {
      isFormValid = false;
      updated.workloadGuid = {
        ...workloadGuid,
        validationText: 'Provide a single GUID with no spaces',
      };
    }
  }

  if (nrqlQuery && nrqlQuery.inputValue) {
    const formatRegexp = /^((?=.*SELECT.*FROM)|(?=.*FROM.*SELECT)).*$/i;
    const fieldsRegexp =
      /^.*(?=.*EventName)(?=.*EventStatus)(?=.*EventTimeStamp).*$/;

    if (!formatRegexp.test(nrqlQuery.inputValue)) {
      isFormValid = false;
      updated.nrqlQuery = {
        ...nrqlQuery,
        validationText: 'Provided value is not correct NRQL query',
      };
    } else if (!fieldsRegexp.test(nrqlQuery.inputValue)) {
      isFormValid = false;
      updated.nrqlQuery = {
        ...nrqlQuery,
        validationText:
          'Query must contain following fields/aliases: EventName, EventStatus and EventTimeStamp',
      };
    }
  }

  if (providerName.inputValue === 'statusIo') {
    const regExp = /\/pages\/history\/[a-z0-9]+$/g;
    if (!regExp.test(hostName.inputValue)) {
      isFormValid = false;
      updated.hostName = {
        ...hostName,
        validationText:
          'Please provide a valid StatusIO URL according to the documentation',
      };
    }
  }

  if (providerName.inputValue === PROVIDERS.APPLE.value) {
    if (!isAllowedAppleUrl(hostName.inputValue)) {
      isFormValid = false;
      updated.hostName = {
        ...hostName,
        validationText:
          'Apple provider hostname must be an https URL under www.apple.com/support/systemstatus/data/',
      };
    }
  }

  if (updated.hostName && updated.hostName.inputValue) {
    if (/^http:\/\//i.test(updated.hostName.inputValue)) {
      isFormValid = false;
      updated.hostName = {
        ...updated.hostName,
        validationText: 'http protocol is not allowed',
      };
    }
  }

  return { isFormValid, updated };
};

const CreateServiceModal = ({ hidden, onClose, onAdd }) => {
  const [selectedPopularSiteIndex, setSelectedPopularSiteIndex] = useState('');
  const [hostRequiresProxy, setHostRequiresProxy] = useState(false);
  const [formInputs, setFormInputs] = useState(initialFormInputs);

  const clearFormInputs = useCallback(() => {
    setFormInputs((prev) => {
      const next = {};
      Object.keys(prev).forEach((k) => {
        next[k] = { ...emptyInputState };
      });
      delete next.nrqlQuery;
      delete next.workloadGuid;
      delete next.subDomain;
      next.hostName = { ...emptyInputState };
      return next;
    });
    setSelectedPopularSiteIndex('');
  }, []);

  const handleAddNewService = useCallback(async () => {
    const { isFormValid, updated } = validateServiceForm(formInputs);
    setFormInputs(updated);
    if (!isFormValid) return;

    const {
      serviceName,
      hostName,
      providerName,
      logoUrl,
      nrqlQuery,
      workloadGuid,
      corsProxyAddress,
      subDomain,
    } = formInputs;

    let formattedHostName;
    if (providerName.inputValue === PROVIDERS.STATUS_PAL.value) {
      formattedHostName = encodeURI(
        `https://${subDomain.inputValue}.statuspal.io`
      );
    } else if (
      providerName.inputValue !== PROVIDERS.NRQL.value &&
      providerName.inputValue !== PROVIDERS.WORKLOAD.value
    ) {
      formattedHostName = hostRequiresProxy
        ? corsProxyAddress.inputValue.replace('{url}', hostName?.inputValue)
        : hostName?.inputValue;
      formattedHostName = encodeURI(formattedHostName);
    }

    const hostNameObject = {
      id: uuidv4(),
      serviceName: serviceName.inputValue,
      hostName: formattedHostName,
      provider: providerName.inputValue,
      hostLogo: logoUrl.inputValue,
      nrqlQuery: nrqlQuery?.inputValue,
      workloadGuid: workloadGuid?.inputValue,
      subDomain: subDomain?.inputValue,
    };

    await onAdd(hostNameObject);
    clearFormInputs();
  }, [formInputs, hostRequiresProxy, onAdd, clearFormInputs]);

  const handleQuickSetupSelect = useCallback((e) => {
    const indexOfPopularSite = e.target.value;
    if (indexOfPopularSite === '') {
      setFormInputs((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          next[k] = { ...emptyInputState };
        });
        delete next.nrqlQuery;
        delete next.workloadGuid;
        delete next.subDomain;
        next.hostName = { ...emptyInputState };
        return next;
      });
      setSelectedPopularSiteIndex('');
      return;
    }

    const selectedPopularSite = popularSites.sites[indexOfPopularSite];
    setFormInputs((prev) => {
      const next = { ...prev };
      if (
        next.providerName.inputValue !== PROVIDERS.NRQL.value &&
        next.providerName.inputValue !== PROVIDERS.WORKLOAD.value
      ) {
        next.hostName = { ...emptyInputState };
        delete next.nrqlQuery;
        delete next.workloadGuid;
      }
      next.hostName = {
        ...emptyInputState,
        inputValue: selectedPopularSite.hostName,
      };
      next.serviceName = {
        ...emptyInputState,
        inputValue: selectedPopularSite.serviceName,
      };
      next.providerName = {
        ...emptyInputState,
        inputValue: selectedPopularSite.provider,
      };
      next.logoUrl = {
        ...emptyInputState,
        inputValue: selectedPopularSite.hostLogo,
      };
      Object.keys(next).forEach((k) => {
        next[k] = { ...next[k], validationText: '' };
      });
      return next;
    });
    setSelectedPopularSiteIndex(indexOfPopularSite);
  }, []);

  const handleCORSChange = useCallback((e) => {
    const isChecked = e.target.checked;
    setFormInputs((prev) => {
      const next = { ...prev };
      if (isChecked) {
        next.corsProxyAddress = {
          ...emptyInputState,
          inputValue: `${PROXY_BASE}{url}`,
        };
      } else {
        delete next.corsProxyAddress;
      }
      return next;
    });
    setHostRequiresProxy(isChecked);
  }, []);

  const handleProviderChange = useCallback((e) => {
    const value = e.target.value;
    setFormInputs((prev) => {
      const next = { ...prev, providerName: { ...prev.providerName } };
      next.providerName.inputValue = value;
      if (!value) return next;

      next.providerName.validationText = '';
      if (value === PROVIDERS.NRQL.value) {
        delete next.hostName;
        delete next.workloadGuid;
        next.nrqlQuery = { ...emptyInputState };
      } else if (value === PROVIDERS.WORKLOAD.value) {
        delete next.hostName;
        delete next.nrqlQuery;
        next.workloadGuid = { ...emptyInputState };
      } else if (value === PROVIDERS.STATUS_PAL.value) {
        delete next.hostName;
        delete next.nrqlQuery;
        delete next.workloadGuid;
        next.subDomain = { ...emptyInputState };
      } else {
        delete next.nrqlQuery;
        delete next.workloadGuid;
        next.hostName = { ...emptyInputState };
      }
      return next;
    });
  }, []);

  const updateInputValue = useCallback((e, inputName) => {
    const value = e.target.value;
    setFormInputs((prev) => ({
      ...prev,
      [inputName]: {
        ...prev[inputName],
        inputValue: value,
        validationText: value.length > 2 ? '' : prev[inputName].validationText,
      },
    }));
  }, []);

  return (
    <Modal hidden={hidden} onClose={onClose}>
      <HeadingText className="modal-heading" type={HeadingText.TYPE.HEADING_2}>
        Add new service
      </HeadingText>
      <p className="modal-paragraph">
        Select a common service from the &quot;quick setup&quot; dropdown below,
        or provide the information needed to determine the status of the service
        you&apos;d like to add. You will be able to edit this information in the
        future.
      </p>

      <CreateServiceFields
        formInputs={formInputs}
        hostRequiresProxy={hostRequiresProxy}
        selectedPopularSiteIndex={selectedPopularSiteIndex}
        onQuickSetupSelect={handleQuickSetupSelect}
        onCORSChange={handleCORSChange}
        onProviderChange={handleProviderChange}
        onUpdateInputValue={updateInputValue}
      />

      <Button
        className="modal-button"
        type={Button.TYPE.TERTIARY}
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button
        className="modal-button"
        type={Button.TYPE.PRIMARY}
        onClick={handleAddNewService}
      >
        Add new service
      </Button>
    </Modal>
  );
};

CreateServiceModal.propTypes = {
  hidden: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default CreateServiceModal;
