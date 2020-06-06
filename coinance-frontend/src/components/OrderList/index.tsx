import React from 'react';
import { TableContainer, Table, Card, CardContent, Typography, TableHead, TableRow, TableCell, TableBody, makeStyles, Chip, Divider, Button, Tooltip } from "@material-ui/core";
import { OrderType, OrderStatus, Order } from '../../models/order';
import { Check, Clear } from '@material-ui/icons';
import { AxiosError } from 'axios';
import { IErrorData, Status } from '../../models/common';
import ErrorAlert from '../common/ErrorAlert';
import { Link } from 'react-router-dom';

interface OrderStatusChipProps {
  order: Order;
  onCancel?: () => void;
}

const OrderStatusChip: React.FC<OrderStatusChipProps> = ({ order, onCancel }) => {
  const { order_type, status, currency_pair: { currency_to: { symbol }} } = order;

  const icon = status !== OrderStatus.ordered
    ? status === OrderStatus.tarded ? <Check scale={1} /> : <Clear scale={1} />
    : undefined;
  const color = status === OrderStatus.tarded
    ? order_type === OrderType.buy ? 'primary' : 'secondary'
    : 'default';
  
  const variant = status === OrderStatus.ordered ? 'outlined' : 'default';
  const cancel = status === OrderStatus.ordered ? onCancel : undefined;

  const createdDatetimeString = `${order.created?.toLocaleString()} 에 주문됨`;
  const tradedDatetimeString = `${order.traded?.toLocaleString()} 에 체결됨`;

  return (
    <Tooltip title={order.traded ? tradedDatetimeString : createdDatetimeString} interactive>
      <Chip label={symbol} icon={icon} variant={variant} color={color} onDelete={cancel} size="small" />
    </Tooltip>
  );
}

interface OrderItemProps {
  showCurrency: boolean;
  order: Order;
  onCancel: (order: Order) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({ showCurrency, order, onCancel }) => {
  return (
    <TableRow>
      {showCurrency ? (
        <TableCell>
          <Link to={`/trading/${order.currency_pair.id}`}>
            <Button size="small" variant="outlined">
              {order.currency_pair.currency_to.symbol}/{order.currency_pair.currency_from.symbol}
            </Button>
          </Link>
        </TableCell>
      ) : <></>}
      <TableCell align="right">
        <Typography color={order.order_type === OrderType.buy ? 'primary' : 'secondary'} component="span">
          {order.price.toFixed(8)} <Chip label={order.currency_pair.currency_from.symbol} variant="outlined" size="small" color={order.order_type === OrderType.buy ? 'primary' : 'secondary'} />
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography component="span">
          {order.amount.toFixed(8)} <OrderStatusChip order={order} onCancel={() => onCancel(order)} />
        </Typography>
      </TableCell>
    </TableRow>
  );
};

interface OrderListProps {
  status: Status;
  errors?: AxiosError<IErrorData>;
  showCurrency: boolean;
  orders: Order[];
  onCancel: (order: Order) => void;
}

const useOrderListStyles = makeStyles({
  container: {
    height: 360,
  },
});

const OrderList: React.FC<OrderListProps> = ({ status, errors, showCurrency, orders, onCancel }) => {
  const classes = useOrderListStyles();

  return (
    <Card elevation={0}>
      <CardContent>
        <Typography variant="h5" component="h3">
          나의 거래내역
        </Typography>
      </CardContent>
      <Divider />
      <ErrorAlert open={status === Status.error} errors={errors} />
      <TableContainer className={classes.container}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {showCurrency ? <TableCell>마켓</TableCell> : <></>}
              <TableCell align="right">가격</TableCell>
              <TableCell align="right">수량</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0
              ? <TableRow><TableCell align="center" colSpan={showCurrency ? 3 : 2}>거래내역이 없습니다.</TableCell></TableRow>
              : orders.map(order => (
                <OrderItem key={order.id} showCurrency={showCurrency} order={order} onCancel={onCancel} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default OrderList;