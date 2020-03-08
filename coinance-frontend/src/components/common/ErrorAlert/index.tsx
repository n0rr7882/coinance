import React from 'react';
import { AxiosError } from 'axios';
import { Alert } from '@material-ui/lab';
import { IErrorData } from '../../../models/common';

interface IProps {
  open: boolean;
  errors?: AxiosError<IErrorData>;
}

const ErrorAlert: React.FC<IProps> = ({ open, errors }) => {
  return open
    ? <Alert severity="error"> {errors?.response?.data.detail || '오류가 발생하였습니다.'} </Alert>
    : <></>;
}

export default ErrorAlert;