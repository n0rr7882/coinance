import React from "react";
import {
  Wallet,
  WalletSummary as WalletSummaryModel,
} from "../../models/wallet";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  Chip,
} from "@material-ui/core";
import WalletChart from "../WalletChart";
import { Skeleton } from "@material-ui/lab";

interface WalletSummaryTextAreaProps {
  summary: WalletSummaryModel;
}

const WalletSummaryTextArea: React.FC<WalletSummaryTextAreaProps> = ({
  summary,
}) => (
  <CardContent>
    <Typography variant="body1" component="label" color="textSecondary">
      수익률
    </Typography>
    <Typography
      variant="h1"
      component="p"
      color={summary.profit_rate >= 0 ? "primary" : "secondary"}
    >
      <b>{(summary.profit_rate * 100).toFixed(2)}</b>%
    </Typography>
    <br />
    <Typography variant="body1" component="label" color="textSecondary">
      수익금{" "}
      <Chip
        label={summary.start_currency.symbol}
        variant="outlined"
        size="small"
      />
    </Typography>
    <Typography variant="h3" component="p">
      <b>{summary.profit_amount}</b>
    </Typography>
    <br />
    <Typography variant="body1" component="label" color="textSecondary">
      보유 현황{" "}
      <Chip
        label={summary.start_currency.symbol}
        variant="outlined"
        size="small"
      />
    </Typography>
    <Typography variant="h4" component="p">
      <b>{summary.total}</b>
    </Typography>
    <div style={{ height: "100%" }}></div>
    <Typography variant="caption" color="textSecondary">
      {summary.aggregated.toLocaleString()} 기준
    </Typography>
  </CardContent>
);

const WalletSummaryTextAreaSkeleton: React.FC = () => (
  <CardContent>
    <Typography variant="body1" component="label" color="textSecondary">
      수익률
    </Typography>
    <Skeleton height={112} />
    <br />
    <Typography variant="body1" component="label" color="textSecondary">
      수익금
    </Typography>
    <Skeleton height={57} />
    <br />
    <Typography variant="body1" component="label" color="textSecondary">
      보유 현황
    </Typography>
    <Skeleton height={40} />

    <Skeleton height={14} />
  </CardContent>
);

interface Props {
  wallets: Wallet[];
  summary?: WalletSummaryModel;
}

const WalletSummary: React.FC<Props> = ({ wallets, summary }) => {
  return (
    <Card elevation={0}>
      <CardContent>
        <Typography variant="h5" component="h3">
          Summary
        </Typography>
      </CardContent>
      <Divider />
      <Grid container>
        <Grid item md={6} xs={12}>
          <WalletChart wallets={wallets} />
        </Grid>
        <Grid item md={6} xs={12}>
          {summary ? (
            <WalletSummaryTextArea summary={summary} />
          ) : (
            <WalletSummaryTextAreaSkeleton />
          )}
        </Grid>
      </Grid>
    </Card>
  );
};

export default WalletSummary;
