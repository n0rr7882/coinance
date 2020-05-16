import React from 'react';
import { usePaperStyles } from '../../utils/styles';
import { Container, Paper, Typography } from '@material-ui/core';
import Jumbotron from '../../components/Jumbotron';

const RankingPage = () => {
  const { paper } = usePaperStyles();

  return (
    <Container maxWidth="md">
      <Paper className={paper} variant="outlined">
        <Jumbotron />
      </Paper>
      <Typography variant="h4" align="center">랭킹 기능은 곧 제공됩니다!</Typography>
    </Container>
  );
};

export default RankingPage;
