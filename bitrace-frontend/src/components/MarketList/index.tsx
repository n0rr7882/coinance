import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { CurrencyPair } from '../../models/currency-pair';
import MarketItem from '../MarketItem';
import { observer } from 'mobx-react';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

interface IProps {
  currencyPairs: CurrencyPair[];
}

const MarketList: React.FC<IProps> = props => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="market list">
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell align="right">현재가</TableCell>
            <TableCell align="right">전일대비(%)</TableCell>
            <TableCell align="right">거래대금(24h)</TableCell>
            <TableCell align="right">화폐명</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.currencyPairs.map(currencyPair => (
            <MarketItem currencyPair={currencyPair} key={currencyPair.id} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default observer(MarketList);