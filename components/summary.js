import React from 'react';
import PropTypes from 'prop-types';
import { HeadingText, Spinner, Stack, StackItem } from 'nr1';

export default class Summary extends React.PureComponent {
  static propTypes = {
    statusPageIoSummaryData: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { statusPageIoSummaryData } = this.props;
    if (!statusPageIoSummaryData) return <Spinner fillContainer />;
    return (
      <Stack
        className="summary-container"
        fullWidth
        verticalType={Stack.VERTICAL_TYPE.CENTER}
        horizontalType={Stack.HORIZONTAL_TYPE.FILL}
        gapType={Stack.GAP_TYPE.NONE}
      >
        <StackItem className="summary-header">
          <HeadingText
            type={HeadingText.TYPE.HEADING_3}
            className="status-page-name"
          >
            {statusPageIoSummaryData.name}
          </HeadingText>
        </StackItem>
        <StackItem className="summary-current-status-stack-item">
          <h5
            className={`summary-current-status ${statusPageIoSummaryData.indicator}`}
          >
            {statusPageIoSummaryData.description}
          </h5>
        </StackItem>
      </Stack>
    );
  }
}
