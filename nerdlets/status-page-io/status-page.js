import React from 'react';
import PropTypes from 'prop-types';
import Summary from './components/summary';

import CurrentIncidents from './components/current-incidents';

export default class StatusPage extends React.Component {
    static propTypes = {
        nerdletUrlState: PropTypes.object,
        launcherUrlState: PropTypes.object,
        width: PropTypes.number,
        height: PropTypes.number,
        refreshRate: PropTypes.number
    };

    render() {
        const {provider} = this.props;
        return (
            <div className="status-page-container">
                <Summary refreshRate={this.props.refreshRate} hostname={this.props.hostname} provider={provider}/>
                <CurrentIncidents refreshRate={this.props.refreshRate} hostname={this.props.hostname} provider={provider}/>
            </div>
        )
    }
}
