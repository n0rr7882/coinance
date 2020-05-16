import React from 'react';
import { Wallet } from "../../models/wallet";
import { observer } from "mobx-react";
import { TableRow, TableCell, Tooltip, Chip } from '@material-ui/core';

interface IProps {
  wallet: Wallet;
}

@observer
class WalletItem extends React.Component<IProps> {
  render() {
    const { wallet } = this.props;
    const symbol = wallet.currency.symbol;
    const name = wallet.currency.name;
    const amount = wallet.amount;

    return (
      <TableRow key={wallet.id}>
        <TableCell component="th" scope="row">
          <Tooltip title={name}>
            <b>{symbol}</b>
          </Tooltip>
        </TableCell>
        <TableCell align="right">
          {amount} <Chip label={symbol} variant="outlined" size="small" />
        </TableCell>
      </TableRow>
    );
  }
}

export default WalletItem;
