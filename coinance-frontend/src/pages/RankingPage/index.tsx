import React, { useEffect } from "react";
import { usePaperStyles, useContainerStyles } from "../../utils/styles";
import { Container, Paper, Typography } from "@material-ui/core";
import Jumbotron from "../../components/Jumbotron";

const RankingPage = () => {
  const { container } = useContainerStyles();
  const { paper } = usePaperStyles();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <Container maxWidth="md" className={container}>
      <Paper className={paper} variant="outlined">
        <Jumbotron />
      </Paper>
      <Typography variant="h4" align="center">
        랭킹 기능은 곧 제공됩니다!
      </Typography>
    </Container>
  );
};

export default RankingPage;
