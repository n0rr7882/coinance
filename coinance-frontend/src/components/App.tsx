import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AppBarContainer from '../containers/AppBarContainer';
import IndexPage from '../pages/IndexPage';
import TradingPage from '../pages/TradingPage';
import RankingPage from '../pages/RankingPage';
import MyPage from '../pages/MyPage';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  main: {
    marginTop: 48,
    paddingTop: 0.1,
  },
});

export default function App() {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <AppBarContainer />
      <div className={classes.main}>
        <Switch>
          <Route path="/trading/:id" component={TradingPage} />
          <Route path="/ranking" component={RankingPage} />
          <Route path="/mypage" component={MyPage} />
          <Route path="/" component={IndexPage} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}
