import React from 'react';
import { Card, CardContent, CardActions, Button } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { OrderType } from '../../models/order';

const OrderSkeleton: React.FC<{ orderType: OrderType }> = ({ orderType }) => (
  <Card elevation={0}>
    <CardContent>
      <Skeleton variant="text" height={40} width={100} animation="wave" />
      <Skeleton variant="text" height={25} width={150} animation="wave" />
      <Skeleton variant="text" width={250} animation="wave" />
      <Skeleton variant="text" height={40} animation="wave" />
      <Skeleton variant="text" height={40} animation="wave" />
    </CardContent>
    <CardActions>
      <Button fullWidth variant="outlined" disableElevation disabled>
        {orderType === OrderType.buy ? '최대매수량' : '최대매도량'}
      </Button>
      <Button fullWidth color="secondary" variant="contained" disableElevation disabled>
        {orderType === OrderType.buy ? '매수' : '매도'}
      </Button>
    </CardActions>
  </Card>
);

export default OrderSkeleton;