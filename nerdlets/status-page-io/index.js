import React from 'react';
import PropTypes from 'prop-types';
import StatusPage from './status-page';

import {Grid, GridItem,} from 'nr1';
import Toolbar from './components/toolbar';

export default class StatusPageIoDemo extends React.Component {
    static propTypes = {
        nerdletUrlState: PropTypes.object,
        launcherUrlState: PropTypes.object,
        width: PropTypes.number,
        height: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = {
            refreshRate: 15
        }
        this.onRefreshRateSelected = this.onRefreshRateSelected.bind(this);
    }

    onRefreshRateSelected(event) {
        this.setState({'refreshRate': parseInt(event.currentTarget.text)});
    }

    render() {
        const {refreshRate} = this.state;
        return (
            <div>
                <Toolbar refreshRateCallback={this.onRefreshRateSelected}/>
                <Grid className="status-container">
                    <GridItem columnStart={1} columnEnd={6}>
                        <StatusPage refreshRate={refreshRate} hostname="https://status.newrelic.com/"/>
                    </GridItem>
                    <GridItem columnStart={7} columnEnd={12}>
                        <StatusPage refreshRate={refreshRate} hostname="https://status.mypurecloud.com"/>
                    </GridItem>
                    <GridItem columnStart={1} columnEnd={6}>
                        <StatusPage refreshRate={refreshRate} hostname="https://bitbucket.status.atlassian.com/"/>
                    </GridItem>
                    <GridItem columnStart={7} columnEnd={12}>
                        <StatusPage refreshRate={refreshRate} hostname="https://jira-software.status.atlassian.com/"/>
                    </GridItem>
                </Grid>
            </div>
        )
    }
}
