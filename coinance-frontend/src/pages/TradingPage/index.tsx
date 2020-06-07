import React from 'react';
import TradingChartContainer from '../../containers/TradingChartContainer';
import { Container, Paper, Grid } from '@material-ui/core';
import { usePaperStyles, useContainerStyles } from '../../utils/styles';
import OrderListCurrencyContainer from '../../containers/OrderListCurrencyContainer';
import OrderBookContainer from '../../containers/OrderBookContainer';
import OrderFormWrapper from '../../components/OrderFormWrapper';
import TradeHistoryContainer from '../../containers/TradeHistoryContainer';



const TradingPage = () => {
  const { container } = useContainerStyles();
  const { paper } = usePaperStyles();

  return (
    <Container maxWidth="lg" className={container}>
      <Grid container>
        <Grid item md={9} xs={12}>
          <Paper className={paper} variant="outlined">
            <TradingChartContainer />
          </Paper>
        </Grid>
        <Grid item md={3} xs={12}>
          <Paper className={paper} variant="outlined">
            <OrderFormWrapper />
          </Paper>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item md={6} xs={12}>
          <Paper className={paper} variant="outlined">
            <OrderBookContainer />
          </Paper>
        </Grid>
        <Grid item md={6} xs={12}>
          <Paper className={paper} variant="outlined">
            <OrderListCurrencyContainer />
          </Paper>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Paper className={paper} variant="outlined">
            <TradeHistoryContainer />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TradingPage;
