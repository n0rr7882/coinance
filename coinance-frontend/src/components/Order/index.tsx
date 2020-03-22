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

interface OrderProps {
  status: Status;
  errors?: AxiosError<IErrorData>;
  orderType: OrderType;
  currencyPair?: CurrencyPair;
  control: OrderControl;
  setMaxAmount: () => void;
  create: () => void;
}

const Order: React.FC<OrderProps> = props => {
  return !props.currencyPair
    ? <OrderSkeleton orderType={OrderType.buy} />
    : (
      <Card elevation={0}>
        <CardContent>
          <Typography variant="h5" component="h3">
            {props.currencyPair.currency_to.symbol} {props.orderType === OrderType.buy ? '매수' : '매도'}
          </Typography>
        </CardContent>
        <Divider />
        {props.control.status === Status.pending ? <LinearProgress color="secondary" /> : <></>}
        <ErrorAlert open={props.status === Status.error} errors={props.errors} />
        <CardContent>
          <FormControl>
            <FormControlLabel
              control={<Switch name="useLastTradePrice" color="secondary" />}
              label={`시장가 ${props.orderType === OrderType.buy ? '매수' : '매도'}`}
            />
            <FormHelperText>
              현재 시장가로 {props.orderType === OrderType.buy ? '매수' : '매도'}합니다.
            </FormHelperText>
          </FormControl>
          <TextField
            fullWidth variant="outlined" margin="dense" label="가격" type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">{props.currencyPair.currency_from.symbol}</InputAdornment>,
            }}
            value={props.control.form.price}
            onChange={e => props.control.form.price = Number(e.target.value)}
            error={!!props.control.errors?.response?.data.price}
            helperText={props.control.errors?.response?.data.price}
          />
          <TextField
            fullWidth variant="outlined" margin="dense" label="수량" type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">{props.currencyPair.currency_to.symbol}</InputAdornment>,
            }}
            value={props.control.form.amount}
            onChange={e => props.control.form.amount = Number(e.target.value)}
            error={!!props.control.errors?.response?.data.amount}
            helperText={props.control.errors?.response?.data.amount}
          />
        </CardContent>
        <CardActions>
          <Button
            fullWidth variant="outlined" disableElevation
            onClick={props.setMaxAmount}
          >
            {props.orderType === OrderType.buy ? '최대매수량' : '최대매도량'}
          </Button>
          <Button
            fullWidth color={props.orderType === OrderType.buy ? 'secondary' : 'primary'} variant="contained" disableElevation
            onClick={props.create}
          >
            {props.orderType === OrderType.buy ? '매수' : '매도'}
          </Button>
        </CardActions>
      </Card>
    );
};

export default observer(Order);
