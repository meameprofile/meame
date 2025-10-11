// scripts/_shims/actions.types.ts
export interface SuccessResult<T> {
  success: true;
  data: T;
}
export interface ErrorResult {
  success: false;
  error: string;
}
export type ActionResult<T> = SuccessResult<T> | ErrorResult;
