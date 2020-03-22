import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, TextField, Switch, FormControl, FormControlLabel, FormHelperText, InputAdornment } from "@material-ui/core";

const OrderBuy: React.FC = props => {
  return (
    <Card elevation={0}>
      <CardContent>
        <Typography variant="h5" component="h3">
          BTC 매수
        </Typography>
        <FormControl>
          <FormControlLabel
            control={<Switch name="useLastTradePrice" color="secondary" />}
            label="시장가 매수"
          />
          <FormHelperText>자동으로 가격을 현재가로 채웁니다.</FormHelperText>
        </FormControl>
        <TextField
          fullWidth variant="outlined" margin="dense" label="가격" type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">USDT</InputAdornment>,
          }}
        />
        <TextField
          fullWidth variant="outlined" margin="dense" label="수량" type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">BTC</InputAdornment>,
          }}
        />
      </CardContent>
      <CardActions>
        <Button fullWidth variant="outlined" disableElevation>
          최대매수량
        </Button>
        <Button fullWidth color="secondary" variant="contained" disableElevation>
          매수
        </Button>
      </CardActions>
    </Card>
  );
};

export default OrderBuy;
