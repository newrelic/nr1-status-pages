import React from 'react';
import StatusPagesDashboard from './main-page';
import { Icon, nerdlet, NerdletStateContext } from 'nr1';

import { HelpModal, Messages } from '@newrelic/nr-labs-components';

export default class Wrapper extends React.PureComponent {
  state = {
    helpModalOpen: false,
  };

  componentDidMount() {
    nerdlet.setConfig({
      actionControls: true,
      actionControlButtons: [
        {
          label: 'Help',
          hint: 'Quick links to get support',
          type: 'primary',
          iconType: Icon.TYPE.INTERFACE__INFO__HELP,
          onClick: () => this.setHelpModalOpen(true),
        },
      ],
    });
  }

  setHelpModalOpen = (helpModalOpen) => {
    this.setState({ helpModalOpen });
  };

  render() {
    const { helpModalOpen } = this.state;

    return (
      <div>
        <Messages repo="nr1-status-pages" branch="main" />
        <NerdletStateContext.Consumer>
          {(nerdletUrlState) => {
            const { entityGuid } = nerdletUrlState;
            const type = entityGuid ? 'entity' : 'account';
            if (type === 'entity') {
              return <StatusPagesDashboard entityGuid={entityGuid} />;
            } else {
              return <StatusPagesDashboard />;
            }
          }}
        </NerdletStateContext.Consumer>
        <HelpModal
          isModalOpen={helpModalOpen}
          setModalOpen={this.setHelpModalOpen}
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
              src: 'https://drive.google.com/uc?id=1BdXVy2X34rufvG4_1BYb9czhLRlGlgsT',
              alt: 'New Relic Labs',
            },
            blurb: {
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
  }
}
