import React from "react";
import { Wallet } from "../../models/wallet";
import { observer } from "mobx-react";
import { TableRow, TableCell, Tooltip, Chip } from "@material-ui/core";

interface IProps {
  wallet: Wallet;
}

@observer
class WalletItem extends React.Component<IProps> {
  render() {
    const { wallet } = this.props;
    return (
      <TableRow key={wallet.id}>
        <TableCell component="th" scope="row">
          <Tooltip title={wallet.currency.name}>
            <b>{wallet.currency.symbol}</b>
          </Tooltip>
        </TableCell>
        <TableCell align="right">
          {wallet.amount}{" "}
          <Chip
            label={wallet.currency.symbol}
            variant="outlined"
            size="small"
          />
        </TableCell>
        <TableCell align="right">
          {wallet.aggregated_amount_to_start_currency_price}{" "}
          <Chip
            label={wallet.start_currency.symbol}
            variant="outlined"
            size="small"
          />
        </TableCell>
      </TableRow>
    );
  }
}

export default WalletItem;
