import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { Status, IErrorData } from '../../models/common';
import { AxiosError } from 'axios';
import { UserSetting } from '../../models/user';
import ErrorAlert from '../common/ErrorAlert';
import LoadingBackdrop from '../common/LoadingBackdrop';
import { observer } from 'mobx-react';

interface UserSettingShowDialogProps {
  userSetting: UserSetting;
  onClose: () => void;
  onDelete: () => void;
}

const UserSettingShowDialog: React.FC<UserSettingShowDialogProps> = props => (
  <>
    <DialogContent>
      <DialogContentText>
        설정하신 정보입니다.
      </DialogContentText>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>닉네임</TableCell>
              <TableCell>화폐</TableCell>
              <TableCell>금액</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{props.userSetting.nickname}</TableCell>
              <TableCell>{props.userSetting.start_currency}</TableCell>
              <TableCell>{props.userSetting.start_amount}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </DialogContent>
    <DialogTitle>설정 초기화</DialogTitle>
    <DialogContent>
      <DialogContentText>
        설정을 초기화하여 모의 투자를 새로 진행할 수 있습니다.
      </DialogContentText>
      <Button onClick={props.onDelete} color="secondary" variant="outlined">
        설정 초기화하여 새로 시작하기
      </Button>
    </DialogContent>
    <DialogActions>
      <Button onClick={props.onClose}>
        닫기
      </Button>
    </DialogActions>
  </>
);

interface UserSettingCreateDialogProps {
  errors?: AxiosError<IErrorData>;
  userSetting: UserSetting;
  onCreate: () => void;
}

const UserSettingCreateDialog: React.FC<UserSettingCreateDialogProps> = observer(props => (
  <>
    <DialogContent>
      <DialogContentText>
        본격적인 암호화폐 모의 투자를 위해 필요한 몇가지 정보를 입력해주세요.
      </DialogContentText>
      <TextField
        autoFocus margin="dense" variant="outlined"
        id="nickname" label="닉네임"
        value={props.userSetting.nickname}
        onChange={e => props.userSetting.nickname = e.target.value}
        error={!!props.errors?.response?.data.nickname}
        helperText={props.errors?.response?.data.nickname}
      />
    </DialogContent>
    <DialogTitle>초기자금 설정</DialogTitle>
    <DialogContent>
      <DialogContentText>
        모의 투자 시 사용 할 초기자금을 설정해주세요.<br />
        설정 후 언제든지 초기화 할 수 있습니다.
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
      <Button onClick={props.onCreate} color="primary" variant="contained">
        모의 투자 시작하기!
        </Button>
    </DialogActions>
  </>
));

interface UserSettingDialogProps {
  status: Status;
  errors?: AxiosError<IErrorData>;
  open: boolean;
  userSetting: UserSetting;
  onClose: () => void;
  onCreate: () => void;
  onDelete: () => void;
}

const UserSettingDialog: React.FC<UserSettingDialogProps> = props => {

  return (
    <>
      <Dialog open={props.open} aria-labelledby="user-setting-title">
        <DialogTitle id="user-setting-title">사용자 설정</DialogTitle>
        <ErrorAlert open={props.status === Status.error} errors={props.errors} />
        {!!props.userSetting.id
          ? <UserSettingShowDialog
            userSetting={props.userSetting}
            onClose={props.onClose}
            onDelete={props.onDelete}
          />
          : <UserSettingCreateDialog
            errors={props.errors}
            userSetting={props.userSetting}
            onCreate={props.onCreate}
          />}
      </Dialog>
      <LoadingBackdrop open={props.status === Status.pending} />
    </>
  );
}

export default UserSettingDialog;
