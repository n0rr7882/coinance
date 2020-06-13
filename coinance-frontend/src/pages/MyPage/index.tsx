import React from 'react';
import WalletListContainer from '../../containers/WalletListContainer';
import { Container, Paper, Grid } from '@material-ui/core';
import { usePaperStyles, useContainerStyles } from '../../utils/styles';
import OrderListContainer from '../../containers/OrderListContainer';
import WalletSummaryContainer from '../../containers/WalletSummaryContainer';

const MyPage = () => {
  const { container } = useContainerStyles();
  const { paper } = usePaperStyles();

  return (
    <Container maxWidth="lg" className={container}>
      <Grid container>
        <Grid item xs={12}>
          <Paper className={paper} variant="outlined">
            <WalletSummaryContainer />
          </Paper>
        </Grid>
        <Grid item md={6} xs={12}>
          <Paper className={paper} variant="outlined">
            <WalletListContainer />
          </Paper>
        </Grid>
        <Grid item md={6} xs={12}>
          <Paper className={paper} variant="outlined">
            <OrderListContainer />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MyPage;
