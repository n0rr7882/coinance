import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, TextField, Switch, FormControl, FormControlLabel, FormHelperText, InputAdornment, LinearProgress, Divider } from "@material-ui/core";
import { OrderControl } from '../../stores/order';
import { CurrencyPair } from '../../models/currency-pair';
import OrderSkeleton from '../OrderSkeleton';
import { OrderType } from '../../models/order';
import ErrorAlert from '../common/ErrorAlert';
import { Status, IErrorData } from '../../models/common';
import { AxiosError } from 'axios';
import { observer } from 'mobx-react';
import { Wallet } from '../../models/wallet';
import { f } from '../../utils/number';

interface OrderProps {
  status: Status;
  errors?: AxiosError<IErrorData>;
  orderType: OrderType;
  currencyPair?: CurrencyPair;
  wallet?: Wallet;
  control: OrderControl;
  useMarketPrice: boolean;
  setUseMarketPrice: (checked: boolean) => void;
  setMaxAmount: () => void;
  create: () => void;
}

const Order: React.FC<OrderProps> = props => {
  const isBuy = props.orderType === OrderType.buy;
  const currencyFromSymbol = props.currencyPair?.currency_from.symbol;
  const currencyToSymbol = props.currencyPair?.currency_to.symbol;
  const total = props.control.form.amount * props.control.form.price;
  const commission = isBuy ? 0 : total * (props.currencyPair?.commission_rate || 0);
  const totalWithCommission = total - commission;

  return !props.currencyPair
    ? <OrderSkeleton orderType={OrderType.buy} />
    : (
      <Card elevation={0}>
        <CardContent>
          <Typography variant="h5" component="h3">
            {currencyToSymbol} {isBuy ? '매수' : '매도'}
          </Typography>
          <Typography variant="body2">
            {isBuy ? `매수가능 ${currencyFromSymbol}` : `매도가능 ${currencyToSymbol}`}: <b>{f(props.wallet?.available_amount || 0).toFixed(8)}</b>
          </Typography>
        </CardContent>
        <Divider />
        {props.control.status === Status.pending ? <LinearProgress /> : <></>}
        <ErrorAlert open={props.status === Status.error} errors={props.errors} />
        <CardContent>
          <FormControl>
            <FormControlLabel
              control={(
                <Switch
                  color={isBuy ? 'primary' : 'secondary'}
                  name="useLastTradePrice"
                  checked={props.useMarketPrice}
                  onChange={e => props.setUseMarketPrice(e.target.checked)}
                />
              )}
              label={`시장가 ${isBuy ? '매수' : '매도'}`}
            />
            <FormHelperText>
              시장 {isBuy ? '최저 매도가로 매수' : '최고 매수가로 매도'}합니다.
            </FormHelperText>
          </FormControl>
          <TextField
            fullWidth
            variant="outlined"
            margin="dense"
            label="가격"
            type="tel"
            InputProps={{
              endAdornment: <InputAdornment position="end">{currencyFromSymbol}</InputAdornment>,
            }}
            value={props.control.form.price}
            onChange={e => props.control.form.price = f(Number(e.target.value))}
            error={!!props.control.errors?.response?.data.price}
            helperText={props.control.errors?.response?.data.price}
          />
          <TextField
            fullWidth
            variant="outlined"
            margin="dense"
            label="수량"
            type="tel"
            InputProps={{
              endAdornment: <InputAdornment position="end">{currencyToSymbol}</InputAdornment>,
            }}
            value={props.control.form.amount}
            onChange={e => props.control.form.amount = f(Number(e.target.value))}
            error={!!props.control.errors?.response?.data.amount}
            helperText={props.control.errors?.response?.data.amount}
          />
          <TextField
            disabled
            fullWidth
            variant="filled"
            margin="dense"
            label="총액"
            type="tel"
            InputProps={{
              endAdornment: <InputAdornment position="end">{currencyFromSymbol}</InputAdornment>,
            }}
            value={f(totalWithCommission).toFixed(8)}
            helperText={`수수료: ${props.currencyPair.commission_rate * 100}%`}
          />
        </CardContent>
        <CardActions>
          <Button
            fullWidth
            disableElevation
            variant="outlined"
            onClick={props.setMaxAmount}
          >
            {isBuy ? '최대매수량' : '최대매도량'}
          </Button>
          <Button
            fullWidth
            disableElevation
            variant="contained"
            color={isBuy ? 'primary' : 'secondary'}
            onClick={props.create}
          >
            {isBuy ? '매수' : '매도'}
          </Button>
        </CardActions>
      </Card>
    );
};

export default observer(Order);
