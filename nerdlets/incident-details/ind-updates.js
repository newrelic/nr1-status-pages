import React from 'react';
import PropTypes from 'prop-types';

import {HeadingText} from 'nr1';

export default class IndUpdates extends React.Component {
    static propTypes = {
        update: PropTypes.any
    };

    render() {
      const {update} = this.props;
      return (
          <li className="ind-update-container">
              <HeadingText type={HeadingText.TYPE.HEADING4}> {update.status} @  {new Date(update.created_at).toDateString()} </HeadingText>
              <div>
                  {update.body}
              </div>
          </li>
      )
    }
}
