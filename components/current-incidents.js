import React from 'react';
import PropTypes from 'prop-types';
import Network from '../utilities/network';

import { navigation, Button, Stack, StackItem } from 'nr1';
import FormatService from '../utilities/format-service';

export default class CurrentIncidents extends React.Component {
  static propTypes = {
    hostname: PropTypes.string.isRequired,
    provider: PropTypes.string.isRequired,
    refreshRate: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentIncidents: undefined,
    };
    this.FormatService = new FormatService(this.props.provider);
    this.statusPageNetwork = new Network(
      this.props.hostname,
      this.props.refreshRate,
      this.props.provider
    );
    this.seeMore = this.seeMore.bind(this);
  }

  seeMore() {
    const nerdletWithState = {
      id: 'incident-details',
      urlState: {
        hostname: this.props.hostname,
        provider: this.props.provider,
      },
    };
    navigation.openStackedNerdlet(nerdletWithState);
  }

  componentDidMount() {
    this.statusPageNetwork.pollCurrentIncidents(
      this.setIncidentData.bind(this)
    );
  }

  setIncidentData(data) {
    this.setState({
      currentIncidents: this.FormatService.uniformIncidentData(data),
    });
  }

  render() {
    const { currentIncidents } = this.state;
    if (!currentIncidents) return <div></div>;
    this.statusPageNetwork.refreshRateInSeconds = this.props.refreshRate;
    const latestIncident = currentIncidents[0];
    // Show first current incident and then add a see more button
    return (
      <Stack
        className="current-incident-row"
        fullWidth
        gapType={Stack.GAP_TYPE.NONE}
        horizontalType={Stack.HORIZONTAL_TYPE.FILL}
        verticalType={Stack.VERTICAL_TYPE.CENTER}
      >
        <StackItem className="current-incident-name-stack-item">
          <p className="current-incident-name">
            Latest Incident:
            <span className={`current-incident-text`}>
              {latestIncident ? latestIncident.name : 'None'}
            </span>
          </p>
        </StackItem>
        <StackItem className="current-incident-see-more">
          <Stack verticalType={Stack.VERTICAL_TYPE.TRAILING}>
            <StackItem>
              <Button
                onClick={this.seeMore}
                type={Button.TYPE.NORMAL}
                sizeType={Button.SIZE_TYPE.SMALL}
                iconType={Button.ICON_TYPE.INTERFACE__SIGN__PLUS}
              >
                See More
              </Button>
            </StackItem>
          </Stack>
        </StackItem>
      </Stack>
    );
  }
}
