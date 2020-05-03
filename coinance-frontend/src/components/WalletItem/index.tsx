import React from 'react';
import { Wallet } from "../../models/wallet";
import { observer } from "mobx-react";
import { TableRow, TableCell, Tooltip } from '@material-ui/core';

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
          {amount}
        </TableCell>
      </TableRow>
    );
  }
}

export default WalletItem;
