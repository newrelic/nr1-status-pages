import React from 'react';
import PropTypes from 'prop-types';
import Network from '../utilities/network';

import { HeadingText, Spinner, Stack, StackItem } from 'nr1';
import FormatService from '../utilities/format-service';

export default class Summary extends React.Component {
    static propTypes = {
        hostname: PropTypes.string,
        refreshRate: PropTypes.number
    };

    constructor(props) {
        super(props);
        this.StatusPageNetwork = new Network(this.props.hostname, this.props.refreshRate, this.props.provider);
        this.FormatService = new FormatService(this.props.provider);
        this.state = {
            statusPageIoSummaryData: undefined
        }
    }

    async componentDidMount() {
        this.StatusPageNetwork.pollSummaryData(this.setSummaryData.bind(this));
    }

    setSummaryData(data) {
        this.setState({'statusPageIoSummaryData':  this.FormatService.uniformSummaryData(data)});
    }

    render() {
        const { statusPageIoSummaryData } = this.state;
        this.StatusPageNetwork.refreshRateInSeconds = this.props.refreshRate;
        if (!statusPageIoSummaryData) return <Spinner/>
        return (
            <Stack
                className="summary-container"
                fullWidth
                verticalType={Stack.VERTICAL_TYPE.CENTER}
                horizontalType={Stack.HORIZONTAL_TYPE.FILL }
                gapType={Stack.GAP_TYPE.NONE}
            >
                <StackItem className="summary-header">
                    <HeadingText type={HeadingText.TYPE.HEADING_3} className="status-page-name">{statusPageIoSummaryData.name}</HeadingText>
                </StackItem>
                <StackItem className="summary-current-status-stack-item">
                    <h5 className={`summary-current-status ${statusPageIoSummaryData.indicator}`}>
                        {statusPageIoSummaryData.description}
                    </h5>
                </StackItem>
            </Stack>
        );
    }
}
