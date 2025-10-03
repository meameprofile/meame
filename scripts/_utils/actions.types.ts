// scripts/_shims/actions.types.ts
export type SuccessResult<T> = { success: true; data: T };
export type ErrorResult = { success: false; error: string };
export type ActionResult<T> = SuccessResult<T> | ErrorResult;
