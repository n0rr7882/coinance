import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Skeleton from "@material-ui/lab/Skeleton";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  LinearProgress,
} from "@material-ui/core";
import { Status, IErrorData } from "../../models/common";
import { AxiosError } from "axios";
import { UserSetting } from "../../models/user";
import ErrorAlert from "../common/ErrorAlert";
import { observer } from "mobx-react";
import StartCurrencyField from "../StartCurrencyField";
import { Currency } from "../../models/currency-pair";
import { currencyRepository } from "../../repositories/currency";
import ConfirmButton from "../common/ConfirmButton";

interface UserSettingShowDialogProps {
  userSetting: UserSetting;
  onClose: () => void;
  onDelete: () => void;
}

interface UserSettingShowDialogState {
  startCurrency?: Currency;
}

class UserSettingShowDialog extends React.Component<
  UserSettingShowDialogProps,
  UserSettingShowDialogState
> {
  state: UserSettingShowDialogState = {
    startCurrency: undefined,
  };

  async componentDidMount() {
    const startCurrency = await currencyRepository.one(
      this.props.userSetting.start_currency
    );
    this.setState({ startCurrency });
  }

  render() {
    return (
      <>
        <DialogContent>
          <DialogContentText>설정하신 정보입니다.</DialogContentText>
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
                  <TableCell>{this.props.userSetting.nickname}</TableCell>
                  <TableCell>
                    {this.state.startCurrency ? (
                      `${this.state.startCurrency.name}(${this.state.startCurrency.symbol})`
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell>{this.props.userSetting.start_amount}</TableCell>
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
          <ConfirmButton
            onClick={this.props.onDelete}
            color="secondary"
            variant="outlined"
            dialogTitle="정말로 초기화하시겠습니까?"
            dialogContent="지금까지의 모든 투자 및 수익에 대한 기록이 삭제됩니다."
          >
            설정 초기화하여 새로 시작하기
          </ConfirmButton>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose}>닫기</Button>
        </DialogActions>
      </>
    );
  }
}

interface UserSettingCreateDialogProps {
  errors?: AxiosError<IErrorData>;
  userSetting: UserSetting;
  onCreate: () => void;
}

const UserSettingCreateDialog: React.FC<UserSettingCreateDialogProps> = observer(
  (props) => (
    <>
      <DialogContent>
        <DialogContentText>
          본격적인 암호화폐 모의 투자를 위해 필요한 몇가지 정보를 입력해주세요.
        </DialogContentText>
        <TextField
          autoFocus
          id="nickname"
          margin="dense"
          variant="outlined"
          label="닉네임"
          value={props.userSetting.nickname}
          onChange={(e) => (props.userSetting.nickname = e.target.value)}
          error={!!props.errors?.response?.data.nickname}
          helperText={props.errors?.response?.data.nickname}
        />
      </DialogContent>
      <DialogTitle>초기자금 설정</DialogTitle>
      <DialogContent>
        <DialogContentText>
          모의 투자 시 사용 할 초기자금을 설정해주세요.
          <br />
          설정 후 언제든지 초기화 할 수 있습니다.
        </DialogContentText>
        <StartCurrencyField
          value={props.userSetting.start_currency}
          onChange={(v) => (props.userSetting.start_currency = v)}
          error={!!props.errors?.response?.data.start_currency}
          helperText={props.errors?.response?.data.start_currency}
        />
        <TextField
          fullWidth
          autoFocus
          id="start-amount"
          margin="dense"
          variant="outlined"
          label="금액"
          type="number"
          value={props.userSetting.start_amount}
          onChange={(e) =>
            (props.userSetting.start_amount = Number(e.target.value))
          }
          error={!!props.errors?.response?.data.start_amount}
          helperText={props.errors?.response?.data.start_amount}
        />
      </DialogContent>
      <DialogActions>
        <Button
          disableElevation
          onClick={props.onCreate}
          color="primary"
          variant="contained"
        >
          모의 투자 시작하기!
        </Button>
      </DialogActions>
    </>
  )
);

interface UserSettingDialogProps {
  status: Status;
  errors?: AxiosError<IErrorData>;
  open: boolean;
  userSetting: UserSetting;
  onClose: () => void;
  onCreate: () => void;
  onDelete: () => void;
}

const UserSettingDialog: React.FC<UserSettingDialogProps> = (props) => {
  return (
    <>
      <Dialog open={props.open} aria-labelledby="user-setting-title">
        <DialogTitle id="user-setting-title">사용자 설정</DialogTitle>
        {props.status === Status.pending ? <LinearProgress /> : <></>}
        <ErrorAlert
          open={props.status === Status.error}
          errors={props.errors}
        />
        {!!props.userSetting.id ? (
          <UserSettingShowDialog
            userSetting={props.userSetting}
            onClose={props.onClose}
            onDelete={props.onDelete}
          />
        ) : (
          <UserSettingCreateDialog
            errors={props.errors}
            userSetting={props.userSetting}
            onCreate={props.onCreate}
          />
        )}
      </Dialog>
    </>
  );
};

export default UserSettingDialog;
