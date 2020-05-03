import React from 'react';
import WalletListContainer from '../../containers/WalletListContainer';
import { Container, Paper } from '@material-ui/core';
import { usePaperStyles } from '../../utils/styles';
import OrderListContainer from '../../containers/OrderListContainer';

const MyPage = () => {
  const { paper } = usePaperStyles();

  return (
    <Container maxWidth="lg">
      <Paper className={paper} variant="outlined">
        <WalletListContainer />
      </Paper>
      <Paper className={paper} variant="outlined">
        <OrderListContainer />
      </Paper>
    </Container>
  );
};

export default MyPage;
