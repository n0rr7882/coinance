import React from 'react';
import TradingChartContainer from '../../containers/TradingChartContainer';
import { Container, Paper, Grid } from '@material-ui/core';
import { usePaperStyles } from '../../utils/styles';
import OrderBuyContainer from '../../containers/OrderBuyContainer';
import OrderSellContainer from '../../containers/OrderSellContainer';
import OrderListCurrencyContainer from '../../containers/OrderListCurrencyContainer';
import OrderBookContainer from '../../containers/OrderBookContainer';



const TradingPage = () => {
  const { paper } = usePaperStyles();

  return (
    <Container maxWidth="lg">
      <Paper className={paper} variant="outlined">
        <TradingChartContainer />
      </Paper>
      <Paper className={paper} variant="outlined">
        <Grid container>
          <Grid item xs={6}>
            <OrderBuyContainer />
          </Grid>
          <Grid item xs={6}>
            <OrderSellContainer />
          </Grid>
        </Grid>
      </Paper>
      <Paper className={paper} variant="outlined">
        <OrderBookContainer />
      </Paper>
      <Paper className={paper} variant="outlined">
        <OrderListCurrencyContainer />
      </Paper>
    </Container>
  );
};

export default TradingPage;
