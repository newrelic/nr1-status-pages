import React from 'react';
import PropTypes from 'prop-types';

import {Spinner} from 'nr1';

// TODO: This seems real bad since we are requiring a lib from other nerdlet
import StatusPageNetwork from '../status-page-io/utilities/status-page-io-network';
import IncidentTimeline from './incident-timline';
import FormatService from '../status-page-io/utilities/format-service';

const REFRESH_RATE = 15;

export default class IncidentDetails extends React.Component {
    static propTypes = {
        nerdletUrlState: PropTypes.object,
        incidents: PropTypes.any,
    }

    constructor(props) {
        super(props);
        this.state = {
            incidentData: undefined
        }
        this.FormatService = new FormatService(this.props.nerdletUrlState.provider);
    }

    componentDidMount() {
        if (this.props.nerdletUrlState.provider === 'google') {
            new StatusPageNetwork(this.props.nerdletUrlState.hostname, REFRESH_RATE).pollGoogleCloud(this.setIncidents.bind(this));
        } else {
            new StatusPageNetwork(this.props.nerdletUrlState.hostname, REFRESH_RATE).pollCurrentIncidents(this.setIncidents.bind(this));
        }
    }

    setIncidents(data) {
        this.setState({'incidents':   this.FormatService.uniformIncidentData(data)});
    }

    render() {
        const {incidents} = this.state;
        if (!incidents) return <Spinner />
        return <IncidentTimeline incidents={incidents}></IncidentTimeline>
    }
}
