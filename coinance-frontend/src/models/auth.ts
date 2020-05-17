export interface IGoogleOauth2Data {
  provider: string;
  code: string;
  redirect_uri: string;
}

export interface IGoogleOauth2Result {
  token: string;
  refresh: string;
}

export interface IToken {
  access: string;
  refresh: string;
}