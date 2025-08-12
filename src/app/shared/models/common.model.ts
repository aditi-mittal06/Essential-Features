export interface RequestError {
  message: string;
  code: string;
}
export interface LoginResponse {
  login: {
    success: boolean;
    errors: RequestError[];
  };
}
export type * as COMMON from './common.model.ts';
