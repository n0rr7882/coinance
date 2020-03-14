import React from 'react';
import TradingChartContainer from '../../containers/TradingChartContainer';
import { Container, Paper } from '@material-ui/core';
import { usePaperStyles } from '../../utils/styles';



const TradingPage = () => {
  const { paper } = usePaperStyles();

  return (
    <Container maxWidth="lg">
      <Paper className={paper}>
        <TradingChartContainer />
      </Paper>
    </Container>
  );
};

export default TradingPage;
