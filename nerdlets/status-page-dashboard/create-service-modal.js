import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { HeadingText, Modal, Button, Steps, StepsItem } from 'nr1';

import CreateServiceFields from './create-service-fields';
import CreateServiceReview from './create-service-review';
import { PROVIDERS } from './providers';
import { popularSites } from '../../popular-status-pages';
import { isAllowedAppleUrl } from '../../utilities/apple-helper';
import { PROXY_BASE } from '../../utilities/proxy';

const STEPS = { QUICK_SETUP: 1, DETAILS: 2, REVIEW: 3 };

const emptyInputState = { inputValue: '', validationText: '' };

const initialFormInputs = () => ({
  serviceName: { ...emptyInputState },
  hostName: { ...emptyInputState },
  providerName: { ...emptyInputState },
  nrqlQuery: { ...emptyInputState },
  workloadGuid: { ...emptyInputState },
  logoUrl: { ...emptyInputState },
});

const resetDynamicFields = (prev) => {
  const next = {};
  Object.keys(prev).forEach((k) => {
    next[k] = { ...emptyInputState };
  });
  delete next.nrqlQuery;
  delete next.workloadGuid;
  delete next.subDomain;
  delete next.corsProxyAddress;
  next.hostName = { ...emptyInputState };
  return next;
};

const validateServiceForm = (formInputs) => {
  let isFormValid = true;
  const genericValidationError = 'Please fill this field before proceeding.';

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
  const [activeStep, setActiveStep] = useState(STEPS.QUICK_SETUP);
  const [setupMode, setSetupMode] = useState(null);
  const [maxReachedStep, setMaxReachedStep] = useState(STEPS.QUICK_SETUP);
  const [selectedPopularSiteIndex, setSelectedPopularSiteIndex] = useState('');
  const [hostRequiresProxy, setHostRequiresProxy] = useState(false);
  const [formInputs, setFormInputs] = useState(initialFormInputs);

  const clearFormInputs = useCallback(() => {
    setFormInputs((prev) => resetDynamicFields(prev));
    setHostRequiresProxy(false);
    setSelectedPopularSiteIndex('');
    setSetupMode(null);
    setActiveStep(STEPS.QUICK_SETUP);
    setMaxReachedStep(STEPS.QUICK_SETUP);
  }, []);

  const handleClose = useCallback(() => {
    clearFormInputs();
    onClose();
  }, [clearFormInputs, onClose]);

  const handleAddNewService = useCallback(async () => {
    if (activeStep !== STEPS.REVIEW) return;

    const { isFormValid, updated } = validateServiceForm(formInputs);
    setFormInputs(updated);
    if (!isFormValid) {
      setActiveStep(STEPS.DETAILS);
      return;
    }

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
      id: crypto.randomUUID(),
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
  }, [activeStep, formInputs, hostRequiresProxy, onAdd, clearFormInputs]);

  const handleQuickSetupSelect = useCallback((e) => {
    const indexOfPopularSite = e.target.value;
    if (indexOfPopularSite === '') {
      setFormInputs((prev) => resetDynamicFields(prev));
      setHostRequiresProxy(false);
      setSelectedPopularSiteIndex('');
      setSetupMode(null);
      setActiveStep(STEPS.QUICK_SETUP);
      setMaxReachedStep(STEPS.QUICK_SETUP);
      return;
    }

    const selectedPopularSite = popularSites.sites[indexOfPopularSite];
    setFormInputs((prev) => {
      const next = resetDynamicFields(prev);
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
      return next;
    });
    setHostRequiresProxy(false);
    setSelectedPopularSiteIndex(indexOfPopularSite);
    setSetupMode('popular');
    setActiveStep(STEPS.REVIEW);
    setMaxReachedStep(STEPS.REVIEW);
  }, []);

  const handleManualSetupClick = useCallback(() => {
    if (setupMode !== 'manual') {
      setFormInputs((prev) => resetDynamicFields(prev));
      setHostRequiresProxy(false);
      setSelectedPopularSiteIndex('');
    }
    setSetupMode('manual');
    setActiveStep(STEPS.DETAILS);
    setMaxReachedStep(STEPS.DETAILS);
  }, [setupMode]);

  const handleNextFromDetails = useCallback(() => {
    const { isFormValid, updated } = validateServiceForm(formInputs);
    setFormInputs(updated);
    if (!isFormValid) return;
    setActiveStep(STEPS.REVIEW);
    setMaxReachedStep((prev) => Math.max(prev, STEPS.REVIEW));
  }, [formInputs]);

  const handleStepChange = useCallback(
    (value) => {
      if (setupMode !== 'popular' && value > maxReachedStep) return;
      setActiveStep(value);
    },
    [setupMode, maxReachedStep]
  );

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
      next.providerName.validationText = '';

      if (value === PROVIDERS.NRQL.value) {
        delete next.hostName;
        delete next.workloadGuid;
        delete next.subDomain;
        next.nrqlQuery = { ...emptyInputState };
      } else if (value === PROVIDERS.WORKLOAD.value) {
        delete next.hostName;
        delete next.nrqlQuery;
        delete next.subDomain;
        next.workloadGuid = { ...emptyInputState };
      } else if (value === PROVIDERS.STATUS_PAL.value) {
        delete next.hostName;
        delete next.nrqlQuery;
        delete next.workloadGuid;
        next.subDomain = { ...emptyInputState };
      } else {
        delete next.nrqlQuery;
        delete next.workloadGuid;
        delete next.subDomain;
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

  const stepTwoHasError = useMemo(
    () =>
      Object.values(formInputs).some((field) => field && field.validationText),
    [formInputs]
  );

  return (
    <Modal hidden={hidden} onClose={handleClose}>
      <HeadingText className="modal-heading" type={HeadingText.TYPE.HEADING_2}>
        Add new service
      </HeadingText>
      <p className="modal-paragraph">
        Select a common service from the &quot;quick setup&quot; dropdown below,
        or choose manual setup to provide the information required to determine
        the status of the service you&apos;d like to add.
      </p>

      <Steps
        value={activeStep}
        onChange={(e, value) => handleStepChange(value)}
        className="modal-steps"
      >
        <StepsItem
          style={{ fontSize: '16px' }}
          label="Choose a service"
          value={STEPS.QUICK_SETUP}
          checked={maxReachedStep >= STEPS.DETAILS}
          expanded={activeStep === STEPS.QUICK_SETUP}
        >
          {activeStep === STEPS.QUICK_SETUP && (
            <>
              <div className="select-container">
                <label htmlFor="quick-setup-select">Quick setup</label>
                <select
                  id="quick-setup-select"
                  value={selectedPopularSiteIndex}
                  onChange={handleQuickSetupSelect}
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

              <Button
                className="modal-button"
                type={Button.TYPE.PRIMARY}
                onClick={handleManualSetupClick}
              >
                Manual setup
              </Button>
            </>
          )}
        </StepsItem>

        <StepsItem
          label="Service details"
          value={STEPS.DETAILS}
          checked={maxReachedStep >= STEPS.REVIEW}
          error={stepTwoHasError}
          expanded={activeStep === STEPS.DETAILS}
        >
          {activeStep === STEPS.DETAILS && (
            <>
              <CreateServiceFields
                formInputs={formInputs}
                hostRequiresProxy={hostRequiresProxy}
                isManualSetup={setupMode === 'manual'}
                disabled={setupMode === 'popular'}
                onCORSChange={handleCORSChange}
                onProviderChange={handleProviderChange}
                onUpdateInputValue={updateInputValue}
              />
              {setupMode !== 'popular' && (
                <Button
                  className="wizard-next-button"
                  type={Button.TYPE.PRIMARY}
                  onClick={handleNextFromDetails}
                >
                  Next
                </Button>
              )}
            </>
          )}
        </StepsItem>

        <StepsItem
          label="Review"
          value={STEPS.REVIEW}
          expanded={activeStep === STEPS.REVIEW}
        >
          {activeStep === STEPS.REVIEW && (
            <CreateServiceReview
              formInputs={formInputs}
              hostRequiresProxy={hostRequiresProxy}
            />
          )}
        </StepsItem>
      </Steps>

      <Button
        className="modal-button"
        type={Button.TYPE.TERTIARY}
        onClick={handleClose}
      >
        Cancel
      </Button>
      <Button
        className="modal-button"
        type={Button.TYPE.PRIMARY}
        disabled={activeStep !== STEPS.REVIEW}
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
