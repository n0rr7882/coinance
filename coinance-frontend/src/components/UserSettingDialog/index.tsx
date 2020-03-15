import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';

const UserSettingDialog: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={true} onClose={handleClose} aria-labelledby="user-setting-title">
      <DialogTitle id="user-setting-title">회원 등록</DialogTitle>
      <DialogContent>
        <DialogContentText>
          본격적인 암호화폐 모의 투자를 위해 필요한 몇가지 정보를 입력해주세요.
        </DialogContentText>
        <TextField
          autoFocus margin="dense" variant="outlined"
          id="nickname" label="닉네임"
        />
      </DialogContent>
      <DialogTitle>초기자금 설정</DialogTitle>
      <DialogContent>
        <DialogContentText>
          모의 투자 시 사용 할 초기자금을 설정해주세요.<br />
          후에 마이페이지에서 리셋할 수 있습니다.
        </DialogContentText>
        <FormControl component="fieldset">
          <FormLabel component="legend">화폐</FormLabel>
          <RadioGroup area-label="currency" name="start-currency" value={40}>
            <FormControlLabel
              value={40}
              control={<Radio color="primary" />}
              label="Bitcoin(BTC)"
              labelPlacement="end"
            />
            <FormControlLabel
              value={30}
              control={<Radio color="default" />}
              label="USD Coin(USDC)"
              labelPlacement="end"
            />
          </RadioGroup>
        </FormControl>
        <TextField
          autoFocus margin="dense" variant="outlined" fullWidth
          id="start-amount" label="금액" type="number"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="contained" disableElevation>
          모의 투자 시작하기!
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserSettingDialog;
