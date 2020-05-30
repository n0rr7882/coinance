import React from 'react';
import { TableContainer, Table, Card, CardContent, Typography, TableHead, TableRow, TableCell, TableBody, makeStyles, Chip, Divider, Button } from "@material-ui/core";
import { OrderType, OrderStatus, Order } from '../../models/order';
import { CallMade, CallReceived, Check } from '@material-ui/icons';
import { AxiosError } from 'axios';
import { IErrorData, Status } from '../../models/common';
import ErrorAlert from '../common/ErrorAlert';
import { Link } from 'react-router-dom';

interface OrderTypeChipProps {
  value: OrderType;
}

const OrderTypeChip: React.FC<OrderTypeChipProps> = ({ value }) => {
  const label = value === OrderType.buy ? '매수' : '매도';
  const color = value === OrderType.buy ? 'secondary' : 'primary';
  const icon = value === OrderType.buy ? <CallMade /> : <CallReceived />;

  return <Chip label={label} color={color} icon={icon} size="small" />;
}

interface OrderStatusChipProps {
  value: OrderStatus;
  onCancel?: () => void;
}

const OrderStatusChip: React.FC<OrderStatusChipProps> = ({ value, onCancel }) => {
  const label = value === OrderStatus.ordered
    ? '주문됨'
    : value === OrderStatus.cancelled
      ? '취소됨'
      : '거래됨';
  const icon = value === OrderStatus.tarded ? <Check /> : undefined;
  const variant = value === OrderStatus.ordered ? 'outlined' : 'default';
  const color = value === OrderStatus.tarded ? 'primary' : 'default';
  const cancel = value === OrderStatus.ordered ? onCancel : undefined;

  return <Chip label={label} icon={icon} variant={variant} color={color} onDelete={cancel} size="small" />;
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
            <Button size="small">
              {order.currency_pair.currency_to.symbol}/{order.currency_pair.currency_from.symbol}
            </Button>
          </Link>
        </TableCell>
      ) : <></>}
      <TableCell>
        <OrderTypeChip value={order.order_type} />
      </TableCell>
      <TableCell align="right">
        {order.price.toFixed(8)} <Chip label={order.currency_pair.currency_from.symbol} variant="outlined" size="small" />
      </TableCell>
      <TableCell align="right">
        {order.amount.toFixed(8)} <Chip label={order.currency_pair.currency_to.symbol} variant="outlined" size="small" />
      </TableCell>
      <TableCell>
        <OrderStatusChip value={order.status as OrderStatus} onCancel={() => onCancel(order)} />
      </TableCell>
      <TableCell>
        {order.created?.toLocaleString()}
      </TableCell>
      <TableCell>
        {order.traded?.toLocaleString()}
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
  table: {
    minWidth: 1160,
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
        <Table className={classes.table} size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {showCurrency ? <TableCell>마켓</TableCell> : <></>}
              <TableCell>거래유형</TableCell>
              <TableCell align="right">가격</TableCell>
              <TableCell align="right">수량</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>주문일시</TableCell>
              <TableCell>체결일시</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0
              ? <TableRow><TableCell align="center" colSpan={showCurrency ? 7 : 6}>거래내역이 없습니다.</TableCell></TableRow>
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