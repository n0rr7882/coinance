import React from "react";
import { AxiosError } from "axios";
import { Alert } from "@material-ui/lab";
import { IErrorData } from "../../../models/common";

interface IProps {
  open: boolean;
  errors?: AxiosError<IErrorData>;
}

const ErrorAlert: React.FC<IProps> = ({ open, errors }) => {
  if (!open) return <></>;

  if (errors?.response?.status === 401) {
    return <Alert severity="warning"> 로그인이 필요한 기능입니다. </Alert>;
  }
  if (errors?.response?.status === 403) {
    return <Alert severity="warning"> 권한이 부족합니다. </Alert>;
  }
  if (errors?.response?.status === 400) {
    if (Array.isArray(errors?.response?.data)) {
      return <Alert severity="error">{errors?.response?.data}</Alert>;
    }
    if (errors?.response?.data.detail) {
      return <Alert severity="error">{errors.response.data.detail}</Alert>;
    }
    if (errors?.response?.data.non_field_errors) {
      return (
        <Alert severity="error">{errors.response.data.non_field_errors}</Alert>
      );
    }
    if (typeof errors?.response?.data === "object") {
      return <Alert severity="warning"> 아래 오류를 해결해주세요. </Alert>;
    }
  }

  return <Alert severity="error">예상치 못한 오류가 발생하였습니다.</Alert>;
};

export default ErrorAlert;
