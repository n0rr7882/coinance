import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Wallet } from "../../models/wallet";
import { useTheme, makeStyles } from "@material-ui/core";

const useWalletChartStyles = makeStyles({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

interface Props {
  wallets: Wallet[];
}

const WalletChart: React.FC<Props> = ({ wallets }) => {
  const classes = useWalletChartStyles();
  const theme = useTheme();
  const COLOR_SET = [
    theme.palette.primary.dark,
    theme.palette.primary.main,
    theme.palette.primary.light,
    theme.palette.secondary.dark,
    theme.palette.secondary.main,
    theme.palette.secondary.light,
    theme.palette.info.dark,
    theme.palette.info.main,
    theme.palette.info.light,
    theme.palette.success.dark,
    theme.palette.success.main,
    theme.palette.success.light,
    theme.palette.warning.dark,
    theme.palette.warning.main,
    theme.palette.warning.light,
    theme.palette.error.dark,
    theme.palette.error.main,
    theme.palette.error.light,
  ];

  const composed = wallets.map((wallet) => ({
    id: wallet.id,
    name: wallet.currency.symbol,
    value: wallet.aggregated_amount_to_start_currency_price,
  }));

  const data = {
    labels: composed.map((d) => d.name),
    datasets: [
      {
        data: composed.map((d) => d.value),
        backgroundColor: COLOR_SET,
      },
    ],
  };

  return (
    <div className={classes.container}>
      <Doughnut data={data} />
    </div>
  );
};

export default WalletChart;
