import React, { useCallback, useEffect, useState } from 'react';
import StatusPagesDashboard from './main-page';
import { Icon, nerdlet, NerdletStateContext } from 'nr1';

import { HelpModal, Messages } from '@newrelic/nr-labs-components';

const Wrapper = () => {
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const openHelpModal = useCallback(() => setHelpModalOpen(true), []);

  useEffect(() => {
    nerdlet.setConfig({
      actionControls: true,
      actionControlButtons: [
        {
          label: 'Help',
          hint: 'Quick links to get support',
          type: 'primary',
          iconType: Icon.TYPE.INTERFACE__INFO__HELP,
          onClick: openHelpModal,
        },
      ],
      timePicker: false,
    });
  }, [openHelpModal]);

  return (
    <div>
      <Messages repo="nr1-status-pages" branch="main" />
      <NerdletStateContext.Consumer>
        {(nerdletUrlState) => {
          const { entityGuid } = nerdletUrlState;
          if (entityGuid) {
            return <StatusPagesDashboard entityGuid={entityGuid} />;
          }
          return <StatusPagesDashboard />;
        }}
      </NerdletStateContext.Consumer>
      <HelpModal
        isModalOpen={helpModalOpen}
        setModalOpen={setHelpModalOpen}
        urls={{
          docs: 'https://github.com/newrelic/nr1-status-pages#readme',
          createIssue:
            'https://github.com/newrelic/nr1-status-pages/issues/new?assignees=&labels=bug%2C+needs-triage&template=bug_report.md&title=',
          createFeature:
            'https://github.com/newrelic/nr1-status-pages/issues/new?assignees=&labels=enhancement%2C+needs-triage&template=enhancement.md&title=',
          createQuestion:
            'https://github.com/newrelic/nr1-status-pages/discussions/new/choose',
        }}
        ownerBadge={{
          logo: {
            src: 'https://user-images.githubusercontent.com/1786630/214122263-7a5795f6-f4e3-4aa0-b3f5-2f27aff16098.png',
            alt: 'New Relic Labs',
          },
          blurb: {
            style: { marginLeft: '8px' },
            text: 'This is a New Relic Labs open source app.',
            link: {
              text: 'Take a look at our other repos',
              url: 'https://github.com/newrelic?q=nrlabs-viz&type=all&language=&sort=',
            },
          },
        }}
      />
    </div>
  );
};

export default Wrapper;
