import React from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Check, Close } from '@material-ui/icons';

interface ConfirmButtonProps extends ButtonProps {
  dialogTitle?: string;
  dialogContent?: string;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = (props: ConfirmButtonProps) => {
  const [open, setOpen] = React.useState(false);

  const confirm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (props.onClick) props.onClick(e);
    setOpen(false);
  };

  return (
    <>
      <Button {...props} onClick={(): void => setOpen(true)}>
        {props.children}
      </Button>
      <Dialog open={open} onClose={(): void => setOpen(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{props.dialogTitle || '정말로 진행하시겠습니까?'}</DialogTitle>
        {props.dialogContent ? (
          <DialogContent>
            <DialogContentText id="alert-dialog-description">{props.dialogContent}</DialogContentText>
          </DialogContent>
        ) : <></>}
        <DialogActions>
          <Button onClick={(): void => setOpen(false)} autoFocus startIcon={<Close />}>
            취소
          </Button>
          <Button onClick={confirm} variant="contained" color="secondary" startIcon={<Check />} disableElevation>
            승인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmButton;