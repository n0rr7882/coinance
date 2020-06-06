import React from 'react';
import MarketListContainer from '../../containers/MarketListContainer';
import { Container, Paper, Grid } from '@material-ui/core';
import { usePaperStyles, useContainerStyles } from '../../utils/styles';
import Jumbotron from '../../components/Jumbotron';

const IndexPage = () => {
  const { container } = useContainerStyles();
  const { paper } = usePaperStyles();

  return (
    <Container maxWidth="md" className={container}>
      <Grid container>
        <Grid item xs={12}>
          <Paper className={paper} variant="outlined">
            <Jumbotron />
          </Paper>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Paper className={paper} variant="outlined">
            <MarketListContainer />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default IndexPage;
