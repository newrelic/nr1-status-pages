import React from 'react';
import PropTypes from 'prop-types';
import StatusPageNetwork from '../utilities/status-page-io-network';

import { navigation, Button, HeadingText } from 'nr1';
import FormatService from '../utilities/format-service';

export default class CurrentIncidents extends React.Component {
    static propTypes = {
        hostname: PropTypes.string,
        refreshRate: PropTypes.number
    };

    constructor(props) {
        super(props);
        this.state = {
            currentIncidents: undefined
        }
        this.FormatService = new FormatService(this.props.provider);
        this.statusPageNetwork = new StatusPageNetwork(this.props.hostname, this.props.refreshRate);
        this.seeMore = this.seeMore.bind(this);
    }

    seeMore() {
        const nerdletWithState = {
            id: '8fa8868a-b354-4d8a-aed8-8b757ea3d5f2.incident-details',
            urlState: {
                hostname: this.props.hostname,
                provider: this.props.provider
            }
       };
        navigation.openStackedNerdlet(nerdletWithState);
    }

    componentDidMount() {
        if (this.props.provider === 'google') {
            this.statusPageNetwork.pollGoogleCloud(this.setIncidentData.bind(this));
        } else {
            this.statusPageNetwork.pollCurrentIncidents(this.setIncidentData.bind(this));
        }
    }

    setIncidentData(data) {
        this.setState({'currentIncidents':   this.FormatService.uniformIncidentData(data)});
    }


    render() {
        const {currentIncidents} = this.state;
        if (!currentIncidents || currentIncidents.length === 0) return <div></div>;
        this.statusPageNetwork.refreshRateInSeconds = this.props.refreshRate;
        const latestIncident = currentIncidents[0];
        // Show first current incident and then add a see more button
        return (
            <div className="current-incident-row">
                <div className="current-incident-name">
                    <HeadingText type={HeadingText.TYPE.HEADING3}>Latest Incident:
                        <span className={`current-incidnet-text ${latestIncident.impact}`}>
                            {latestIncident.name}
                        </span>
                    </HeadingText>
                </div>
                <div className="current-incident-see-more">
                    <Button
                        className="btn-white"
                        onClick={this.seeMore}
                        iconType={Button.ICON_TYPE.INTERFACE__SIGN__PLUS}
                        tagType={Button.TAG_TYPE.BUTTON}>See More</Button>
                </div>
            </div>
        )
    }
}