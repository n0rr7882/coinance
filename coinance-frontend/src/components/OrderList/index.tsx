import React from 'react';
import { TableContainer, Table, Card, CardContent, Typography, TableHead, TableRow, TableCell, TableBody, makeStyles, Chip } from "@material-ui/core";
import { OrderType, OrderStatus, Order } from '../../models/order';
import { CallMade, CallReceived, Check } from '@material-ui/icons';

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
        <TableCell>{order.currency_pair.currency_to.symbol} / {order.currency_pair.currency_from.symbol}</TableCell>
      ) : <></>}
      <TableCell>
        <OrderTypeChip value={order.order_type} />
      </TableCell>
      <TableCell>{order.price}</TableCell>
      <TableCell>{order.amount}</TableCell>
      <TableCell>
        <OrderStatusChip value={order.status as OrderStatus} onCancel={() => onCancel(order)} />
      </TableCell>
      <TableCell>
        {order.created?.toLocaleString()}
      </TableCell>
    </TableRow>
  );
};

interface OrderListProps {
  showCurrency: boolean;
  orders: Order[];
  onCancel: (order: Order) => void;
}

const useOrderListStyles = makeStyles({
  table: {
    minWidth: 630,
  },
});

const OrderList: React.FC<OrderListProps> = ({ showCurrency, orders, onCancel }) => {
  const classes = useOrderListStyles();

  return (
    <Card elevation={0}>
      <CardContent>
        <Typography variant="h5" component="h3">
          나의 거래내역
        </Typography>
        <TableContainer>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                {showCurrency ? <TableCell>마켓</TableCell> : <></>}
                <TableCell>거래유형</TableCell>
                <TableCell>가격</TableCell>
                <TableCell>수량</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>주문일시</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(order => (
                <OrderItem key={order.id} showCurrency={showCurrency} order={order} onCancel={onCancel} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

export default OrderList;