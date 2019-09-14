import React from 'react';
import PropTypes from 'prop-types';

import {HeadingText} from 'nr1';

const ReactMarkdown = require('react-markdown')


export default class IndUpdates extends React.Component {
    static propTypes = {
        update: PropTypes.any
    };

    render() {
      const {update} = this.props;
      const updateDate = new Date(update.created_at);
      const statusString = update.status ? `${update.status} @` : '';

      return (
          <li className="ind-update-container">
              <HeadingText type={HeadingText.TYPE.HEADING_4}> {statusString}  {updateDate.toLocaleDateString()} {updateDate.toLocaleTimeString()} </HeadingText>
              <div>
                    <ReactMarkdown source={update.body} />
              </div>
          </li>
      )
    }
}
