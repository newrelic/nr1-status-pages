import React from 'react';
import PropTypes from 'prop-types';
import IndIncident from './ind-incident';

import {Spinner} from 'nr1';

// TODO: This seems real bad since we are requiring a lib from other nerdlet
import StatusPageNetwork from '../status-page-io/utilities/status-page-io-network';

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
    }

    componentDidMount() {
        new StatusPageNetwork(this.props.nerdletUrlState.hostname, REFRESH_RATE).pollCurrentIncidents(this.setIncidents.bind(this));
    }

    setIncidents(data) {
        this.setState({'incidents': data.incidents})
    }

    render() {
        const {incidents} = this.state;
        if (!incidents) return <Spinner />
        const details = incidents.map(incident => <IndIncident key={incident.id} incident={incident}/>)
        return (
            <div>
                 <div className="incident-container">
                    {details}
                </div>
            </div>
        );
    }
}
