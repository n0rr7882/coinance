import React from 'react';
import MarketListContainer from '../../containers/MarketListContainer';
import { Container, Paper } from '@material-ui/core';
import { usePaperStyles } from '../../utils/styles';
import Jumbotron from '../../components/Jumbotron';

const IndexPage = () => {
  const { paper } = usePaperStyles();

  return (
    <Container maxWidth="md">
      <Paper className={paper}>
        <Jumbotron />
      </Paper>
      <Paper className={paper}>
        <MarketListContainer />
      </Paper>
    </Container>
  );
};

export default IndexPage;
