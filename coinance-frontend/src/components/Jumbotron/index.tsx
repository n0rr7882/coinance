import React from 'react';
import { Card, Typography, makeStyles, Theme, CardContent } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    margin: theme.spacing(2),
  },
  media: {
    height: 256,
  },
  title: {
    fontFamily: 'Orbitron',
    fontWeight: 600,
  },
  sub: {
    fontFamily: 'Orbitron',
  }
}));

const Jumbotron: React.FC = () => {
  const classes = useStyles();
  const title = <span className={classes.title}>coinance</span>;

  return (
    <header role="banner">
      <Card elevation={0}>
        <CardContent>
          <Typography className={classes.title} variant="h2" component="h1">
            {title}
          </Typography>
          <Typography className={classes.sub} color="textSecondary">
            Cryptocurrency exchange <b>for MOCK TRADING</b>
          </Typography>
        </CardContent>
      </Card>
    </header>
  );
};

export default Jumbotron;
