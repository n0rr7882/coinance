export interface ICommonParams {
  limit?: number;
  offset?: number;
  q?: string;
  [key: string]: any;
}

export enum Status {
  pending = "pending",
  done = "done",
  error = "error",
}

export interface IErrorData {
  readonly [field: string]: string[] | string | undefined;
}

export type Order = "asc" | "desc";
