import React from 'react';
import PropTypes from 'prop-types';
import StatusPageNetwork from '../utilities/status-page-io-network';

import { HeadingText, Spinner } from 'nr1';
import FormatService from '../utilities/format-service';

export default class Summary extends React.Component {
    static propTypes = {
        hostname: PropTypes.string,
        refreshRate: PropTypes.number
    };

    constructor(props) {
        super(props);
        this.StatusPageNetwork = new StatusPageNetwork(this.props.hostname, this.props.refreshRate);
        this.FormatService = new FormatService(this.props.provider);
        this.state = {
            statusPageIoSummaryData: undefined
        }
    }

    async componentDidMount() {
        if (this.props.provider  === 'google') {
            this.StatusPageNetwork.pollGoogleCloud(this.setSummaryData.bind(this));
        } else {
            this.StatusPageNetwork.pollSummaryData(this.setSummaryData.bind(this));
        }
    }

    setSummaryData(data) {
        this.setState({'statusPageIoSummaryData':  this.FormatService.uniformSummaryData(data)});
    }

    render() {
        const { statusPageIoSummaryData } = this.state;
        this.StatusPageNetwork.refreshRateInSeconds = this.props.refreshRate;
        if (!statusPageIoSummaryData) return <Spinner />
        return (
            <div className="summary-container">
                <div className="summary-header">
                    <HeadingText type={HeadingText.TYPE.HEADING2}>{statusPageIoSummaryData.name}</HeadingText>
                </div>
                <div className={`summary-current-status`}>
                    {statusPageIoSummaryData.description}
                </div>
            </div>
        );
    }
}
