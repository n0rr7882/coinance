import React from 'react';
import { AxiosError } from 'axios';
import { Alert } from '@material-ui/lab';
import { IErrorData } from '../../../models/common';

interface IProps {
  open: boolean;
  errors?: AxiosError<IErrorData>;
}

const ErrorAlert: React.FC<IProps> = ({ open, errors }) => {
  if (!open) return <></>;

  if (Array.isArray(errors?.response?.data)) {
    return <Alert severity="error">{errors?.response?.data}</Alert>
  }
  if (errors?.response?.data.detail) {
    return <Alert severity="error">{errors.response.data.detail}</Alert>;
  }
  if (errors?.response?.data.non_field_errors) {
    return <Alert severity="error">{errors.response.data.non_field_errors}</Alert>;
  }
  return <Alert severity="error">오류가 발생하였습니다.</Alert>;
}

export default ErrorAlert;