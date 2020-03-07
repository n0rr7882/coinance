export interface IRequestLogin {
  username: string;
  password: string;
}

export interface IResponseLogin {
  access: string;
  refresh: string;
}

export interface IRequestRefresh {
  refresh: string;
}

export interface IResponseRefresh {
  access: string;
}